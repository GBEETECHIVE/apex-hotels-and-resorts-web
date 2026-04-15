const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CmsData = require('./models/CmsData');
const Booking = require('./models/Booking');
const AdminUser = require('./models/AdminUser');

dotenv.config({ path: './server/.env' });

const app = express();

const port = Number(process.env.PORT) || 5001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roomy_cms';
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const adminApiKey = process.env.ADMIN_API_KEY || '';
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const jwtSecret = process.env.JWT_SECRET || 'change_this_jwt_secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '12h';
const dataDir = path.join(__dirname, 'data');
const bookingsFile = path.join(dataDir, 'bookings.json');
const cmsFile = path.join(dataDir, 'cms.json');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });


app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir, { maxAge: '30d' }));

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL', 'FROM_EMAIL'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.warn(`Missing SMTP env vars: ${missingEnv.join(', ')}`);
}

if (!adminApiKey) {
  console.warn('ADMIN_API_KEY is not set. Admin endpoints are not protected.');
}

if (jwtSecret === 'change_this_jwt_secret') {
  console.warn('JWT_SECRET is using default value. Set a secure secret in server/.env');
}

const readJsonArray = (filePath, fallback = []) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
};

const readJsonObject = (filePath, fallback = {}) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
};

const normalizeBookingValue = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const getBookingRoomKey = (roomName, resortName) => `${normalizeBookingValue(roomName)}::${normalizeBookingValue(resortName)}`;

const authorizeAdmin = (req, res, next) => {
  const legacyKey = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (adminApiKey && legacyKey === adminApiKey) {
    return next();
  }

  if (bearerToken) {
    try {
      const payload = jwt.verify(bearerToken, jwtSecret);
      if (payload && payload.role === 'admin') {
        req.admin = payload;
        return next();
      }
    } catch (_error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  if (!adminApiKey && !bearerToken) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
};

const issueAdminToken = (admin) =>
  jwt.sign(
    {
      sub: String(admin._id),
      username: admin.username,
      role: admin.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

const ensureMigrationFiles = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(bookingsFile)) {
    fs.writeFileSync(bookingsFile, '[]', 'utf8');
  }
  if (!fs.existsSync(cmsFile)) {
    fs.writeFileSync(cmsFile, JSON.stringify({ destinations: [] }, null, 2), 'utf8');
  }
};

const migrateJsonToMongoIfNeeded = async () => {
  ensureMigrationFiles();

  const cmsCount = await CmsData.countDocuments();
  if (cmsCount === 0) {
    const cms = readJsonObject(cmsFile, { destinations: [] });
    await CmsData.create({
      key: 'main',
      destinations: Array.isArray(cms.destinations) ? cms.destinations : [],
    });
  }

  const bookingCount = await Booking.countDocuments();
  if (bookingCount === 0) {
    const bookings = readJsonArray(bookingsFile, []);
    if (bookings.length > 0) {
      const docs = bookings.map((item) => ({
        bookingId: item.id || `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        fullName: item.fullName || '',
        email: item.email || '',
        mobile: item.mobile || '',
        dateFrom: item.dateFrom || '',
        dateTo: item.dateTo || '',
        persons: String(item.persons || ''),
        roomName: item.roomName || '',
        resortName: item.resortName || '',
        status: item.status || 'new',
        error: item.error || '',
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      }));
      await Booking.insertMany(docs, { ordered: false });
    }
  }
};

const ensureAdminUser = async () => {
  const existing = await AdminUser.findOne({ username: adminUsername });
  if (existing) {
    const isPasswordInSync = await bcrypt.compare(adminPassword, existing.passwordHash);
    if (!isPasswordInSync) {
      existing.passwordHash = await bcrypt.hash(adminPassword, 12);
      existing.isActive = true;
      await existing.save();
      console.log('Default admin password hash synced from environment.');
    }
    return existing;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const created = await AdminUser.create({
    username: adminUsername,
    passwordHash,
    role: 'admin',
    isActive: true,
  });

  return created;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  family: 4,
});

const createAdminHtml = (data) => `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;background:#fff">
    <div style="background:#2d3e50;padding:20px;text-align:center">
      <h2 style="color:#fff;margin:0">APEX Hotels and Resorts</h2>
      <p style="color:#b7c2cc;margin:6px 0 0">New Booking Request</p>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#777">Guest Name</td><td style="padding:8px 0;font-weight:600">${data.fullName}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Guest Email</td><td style="padding:8px 0">${data.email}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Mobile</td><td style="padding:8px 0">${data.mobile}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Resort</td><td style="padding:8px 0">${data.resortName}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Room</td><td style="padding:8px 0">${data.roomName}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Check-in</td><td style="padding:8px 0">${data.dateFrom}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Check-out</td><td style="padding:8px 0">${data.dateTo}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Persons</td><td style="padding:8px 0">${data.persons}</td></tr>
      </table>
    </div>
  </div>
`;

const createGuestHtml = (data) => `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;background:#fff">
    <div style="background:#2d3e50;padding:28px 20px;text-align:center">
      <h2 style="color:#fff;margin:0">APEX Hotels and Resorts</h2>
    </div>
    <div style="padding:26px">
      <p>Dear ${data.fullName},</p>
      <p>
        Thank you for choosing APEX Hotels and Resorts for your upcoming stay. We appreciate your trust in our hospitality and are excited to welcome you to a memorable experience.
      </p>
      <p>
        This email is to confirm that we have received your booking through our website. Our sales representatives will be reaching out to you shortly to finalize the details and provide you with a formal confirmation of your reservation.
      </p>
      <p>
        For any additional information or inquiries, please feel free to contact our dedicated sales team at +92 333 3394078. They will be delighted to assist you and address any questions you may have regarding your reservation, amenities, or special requests.
      </p>
      <p>
        Once again, we appreciate your trust in APEX Hotels and Resorts. We are eagerly looking forward to hosting you and creating unforgettable memories.
      </p>
      <p>
        Warm regards,<br />
        APEX Hotels and Resorts
      </p>
      <hr style="border:none;border-top:1px solid #eaeaea;margin:20px 0" />
      <p style="margin:0;color:#666"><strong>Resort:</strong> ${data.resortName}</p>
      <p style="margin:6px 0;color:#666"><strong>Room:</strong> ${data.roomName}</p>
      <p style="margin:6px 0;color:#666"><strong>Check-in:</strong> ${data.dateFrom}</p>
      <p style="margin:6px 0;color:#666"><strong>Check-out:</strong> ${data.dateTo}</p>
      <p style="margin:6px 0;color:#666"><strong>Persons:</strong> ${data.persons}</p>
    </div>
  </div>
`;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required.' });
  }

  const admin = await AdminUser.findOne({ username, isActive: true });
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const matched = await bcrypt.compare(password, admin.passwordHash);
  if (!matched) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = issueAdminToken(admin);
  return res.json({ token, username: admin.username, role: admin.role });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Roomy backend is running. Frontend is available at http://localhost:3000',
    health: '/api/health',
    cms: '/api/cms',
  });
});

app.get('/api/cms', (_req, res) => {
  CmsData.findOne({ key: 'main' })
    .lean()
    .then((cms) => res.json({ destinations: cms?.destinations || [], homePage: cms?.homePage || {} }))
    .catch((error) => {
      console.error('Failed to load CMS from MongoDB:', error);
      res.status(500).json({ error: 'Failed to load CMS data.' });
    });
});

app.post('/api/admin/upload', authorizeAdmin, (req, res) => {
  const { image } = req.body || {};
  if (!image || !String(image).startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image data.' });
  }
  const matches = String(image).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!matches) {
    return res.status(400).json({ error: 'Invalid image format.' });
  }
  const mimeType = matches[1].toLowerCase();
  const mimeToExt = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/svg+xml': 'svg',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
  };
  const ext = mimeToExt[mimeType] || 'img';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const filepath = path.join(uploadsDir, filename);
  try {
    const normalizedBase64 = matches[2].replace(/\s+/g, '');
    fs.writeFileSync(filepath, Buffer.from(normalizedBase64, 'base64'));
    return res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Failed to save uploaded image:', err);
    return res.status(500).json({ error: 'Failed to save image file.' });
  }
});

app.put('/api/admin/cms', authorizeAdmin, (req, res) => {
  const cmsPayload = req.body;
  if (!cmsPayload || typeof cmsPayload !== 'object') {
    return res.status(400).json({ error: 'Invalid CMS payload.' });
  }
  const update = {};
  if (Array.isArray(cmsPayload.destinations)) {
    update.destinations = cmsPayload.destinations;
  }
  if (cmsPayload.homePage && typeof cmsPayload.homePage === 'object') {
    update.homePage = cmsPayload.homePage;
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'No valid CMS fields provided.' });
  }
  return CmsData.findOneAndUpdate(
    { key: 'main' },
    { $set: update },
    { upsert: true, returnDocument: 'after' }
  )
    .then(() => res.json({ success: true }))
    .catch((error) => {
      console.error('Failed to save CMS in MongoDB:', error);
      res.status(500).json({ error: 'Failed to save CMS data.' });
    });
});

app.post('/api/admin/seed', authorizeAdmin, async (_req, res) => {
  try {
    ensureMigrationFiles();
    const cms = readJsonObject(cmsFile, { destinations: [], homePage: {} });
    const update = {
      destinations: Array.isArray(cms.destinations) ? cms.destinations : [],
    };
    if (cms.homePage && typeof cms.homePage === 'object') {
      update.homePage = cms.homePage;
    }
    await CmsData.findOneAndUpdate(
      { key: 'main' },
      { $set: update },
      { upsert: true, returnDocument: 'after' }
    );
    return res.json({ success: true, message: 'CMS seeded from server/data/cms.json' });
  } catch (error) {
    console.error('Failed to seed CMS:', error);
    return res.status(500).json({ error: 'Failed to seed CMS data.' });
  }
});

app.get('/api/admin/bookings', authorizeAdmin, (_req, res) => {
  Booking.find({})
    .sort({ createdAt: -1 })
    .lean()
    .then((bookings) => {
      const normalized = bookings.map((item) => ({
        id: item.bookingId,
        fullName: item.fullName,
        email: item.email,
        mobile: item.mobile,
        dateFrom: item.dateFrom,
        dateTo: item.dateTo,
        persons: item.persons,
        roomName: item.roomName,
        resortName: item.resortName,
        status: item.status,
        error: item.error,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      res.json({ bookings: normalized });
    })
    .catch((error) => {
      console.error('Failed to fetch bookings from MongoDB:', error);
      res.status(500).json({ error: 'Failed to fetch bookings.' });
    });
});

app.patch('/api/admin/bookings/:id/status', authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ error: 'status is required.' });
  }

  return Booking.findOneAndUpdate(
    { bookingId: id },
    { $set: { status } },
    { returnDocument: 'after' }
  )
    .lean()
    .then((updated) => {
      if (!updated) {
        return res.status(404).json({ error: 'Booking not found.' });
      }
      return res.json({
        booking: {
          id: updated.bookingId,
          fullName: updated.fullName,
          email: updated.email,
          mobile: updated.mobile,
          dateFrom: updated.dateFrom,
          dateTo: updated.dateTo,
          persons: updated.persons,
          roomName: updated.roomName,
          resortName: updated.resortName,
          status: updated.status,
          error: updated.error,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
      });
    })
    .catch((error) => {
      console.error('Failed to update booking status in MongoDB:', error);
      res.status(500).json({ error: 'Failed to update booking status.' });
    });
});

app.get('/api/bookings/availability', async (req, res) => {
  const resortQuery = normalizeBookingValue(req.query?.resortName || '');

  try {
    const confirmed = await Booking.find({ status: 'confirmed' }).lean();
    const unavailableRooms = confirmed
      .filter((item) => {
        if (!resortQuery) return true;
        return normalizeBookingValue(item.resortName) === resortQuery;
      })
      .map((item) => ({
        roomName: item.roomName,
        resortName: item.resortName,
        key: getBookingRoomKey(item.roomName, item.resortName),
      }));

    return res.json({ unavailableRooms });
  } catch (error) {
    console.error('Failed to fetch booking availability:', error);
    return res.status(500).json({ error: 'Failed to fetch booking availability.' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { fullName, email, mobile, dateFrom, dateTo, persons, roomName, resortName } = req.body || {};

  if (!fullName || !email || !mobile || !dateFrom || !dateTo || !persons || !roomName || !resortName) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const bookingRecord = {
    bookingId: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    fullName,
    email,
    mobile,
    dateFrom,
    dateTo,
    persons,
    roomName,
    resortName,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  try {
    const roomKey = getBookingRoomKey(roomName, resortName);
    const confirmedRooms = await Booking.find({ status: 'confirmed' }).lean();
    const conflictingBooking = confirmedRooms.find(
      (row) => getBookingRoomKey(row.roomName, row.resortName) === roomKey
    );

    if (conflictingBooking) {
      return res.status(409).json({
        error: 'This room is already confirmed and not available right now.',
      });
    }

    await transporter.sendMail({
      from: `APEX Hotels and Resorts <${process.env.FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: 'butt16851@gmail.com',
      subject: `New Booking - ${roomName} (${resortName})`,
      html: createAdminHtml({ fullName, email, mobile, dateFrom, dateTo, persons, roomName, resortName }),
    });

    await transporter.sendMail({
      from: `APEX Hotels and Resorts <${process.env.FROM_EMAIL}>`,
      to: email,
      replyTo: 'butt16851@gmail.com',
      subject: 'Confirmation of Your Booking and Contact Information',
      html: createGuestHtml({ fullName, email, mobile, dateFrom, dateTo, persons, roomName, resortName }),
    });

    await Booking.create({ ...bookingRecord, status: 'new' });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('SMTP send error:', error);
    await Booking.create({
      ...bookingRecord,
      status: 'email_failed',
      error: error?.message || 'Unknown SMTP error',
    });
    return res.status(500).json({ error: 'Failed to send booking emails.' });
  }
});

app.use((err, _req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Total upload is too large. Each image must be 4 MB or smaller — please reduce image sizes and try again.',
    });
  }
  return next(err);
});

const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');
    await migrateJsonToMongoIfNeeded();
    await ensureAdminUser();

    app.listen(port, () => {
      console.log(`SMTP backend running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

start();
