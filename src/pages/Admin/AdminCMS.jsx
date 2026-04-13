import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  adminLogin,
  fetchAdminBookings,
  fetchCms,
  seedCms,
  updateBookingStatus,
  updateCms,
} from '../../services/cmsApi';
import './AdminCMS.css';

const toSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const splitLines = (value) =>
  String(value || '')
    .split('\n');

const joinLines = (items) => {
  if (Array.isArray(items)) return items.join('\n');
  if (typeof items === 'string') return items;
  return '';
};

const cleanLines = (items) => {
  const source = Array.isArray(items) ? items : splitLines(items);
  return source.map((line) => String(line || '').trim()).filter(Boolean);
};

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB

const getBase64SizeMb = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return '';
  const base64 = dataUrl.split(',')[1] || '';
  const bytes = Math.ceil(base64.length * 0.75);
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const compressImageFile = (file) => new Promise((resolve, reject) => {
  if (file.size > MAX_IMAGE_BYTES) {
    return reject(new Error(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — each image must be 4 MB or smaller.`));
  }
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(objectUrl);
    const MAX_DIM = 1920;
    let { width, height } = img;
    if (width > MAX_DIM || height > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    resolve(canvas.toDataURL('image/jpeg', 0.78));
  };
  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error(`Failed to load "${file.name}".`));
  };
  img.src = objectUrl;
});

/* ── NAV_ITEMS ─────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'home-hero', label: 'Hero Section', icon: '🖼️' },
  { id: 'home-travel', label: 'Travel Section', icon: '✈️' },
  { id: 'home-locations', label: 'Our Locations', icon: '📍' },
  { id: 'home-dining', label: 'Dine In', icon: '🍽️' },
  { id: 'home-offers', label: 'Offers Banner', icon: '🏷️' },
  { id: 'home-app', label: 'App Section', icon: '📱' },
  { id: 'home-contact', label: 'Contact Info', icon: '📞' },
  { id: 'destinations', label: 'Destinations', icon: '🏔️' },
  { id: 'bookings', label: 'Bookings', icon: '📋' },
];

/* ── ADMIN COMPONENT ──────────────────────────────── */
const AdminCMS = () => {
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cmsData, setCmsData] = useState({ destinations: [], homePage: {} });
  const [bookings, setBookings] = useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState('');
  const [selectedPointId, setSelectedPointId] = useState('');
  const [destTab, setDestTab] = useState('basic');      // basic | points
  const [pointTab, setPointTab] = useState('info');      // info | rooms | activities | gallery
  const [roomImageModal, setRoomImageModal] = useState(null); // {destId, ptId, roomIdx}
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  /* booking filters */
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingPage, setBookingPage] = useState(1);
  const BOOKINGS_PER_PAGE = 10;

  /* ── helpers ───────────────────────────────────── */
  const homePage = cmsData.homePage || {};
  const destinations = cmsData.destinations || [];

  const patchHome = useCallback((key, value) => {
    setCmsData((prev) => ({
      ...prev,
      homePage: { ...(prev.homePage || {}), [key]: value },
    }));
  }, []);

  const patchHomeNested = useCallback((section, field, value) => {
    setCmsData((prev) => ({
      ...prev,
      homePage: {
        ...(prev.homePage || {}),
        [section]: { ...((prev.homePage || {})[section] || {}), [field]: value },
      },
    }));
  }, []);

  /* ── load dashboard ────────────────────────────── */
  const loadDashboard = useCallback(async (authToken) => {
    setLoading(true);
    setError('');
    try {
      const [cmsResult, bookingsResult] = await Promise.allSettled([
        fetchCms(),
        fetchAdminBookings(authToken),
      ]);

      if (bookingsResult.status === 'rejected' && bookingsResult.reason?.status === 401) {
        localStorage.removeItem('admin_token');
        setToken('');
        setError('Session expired. Please login again.');
        return;
      }
      if (cmsResult.status === 'rejected') throw cmsResult.reason;

      const cms = cmsResult.value;
      const bookingsPayload = bookingsResult.status === 'fulfilled' ? bookingsResult.value : { bookings: [] };

      setCmsData({ destinations: cms?.destinations || [], homePage: cms?.homePage || {} });
      setBookings(bookingsPayload?.bookings || []);

      const dests = cms?.destinations || [];
      if (dests[0]) {
        setSelectedDestinationId(dests[0].id);
        setSelectedPointId((dests[0].points || [])[0]?.id || '');
      }
    } catch (err) {
      if (err?.status === 401) {
        localStorage.removeItem('admin_token');
        setToken('');
        setError('Session expired. Please login again.');
        return;
      }
      setError(err.message || 'Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    loadDashboard(token);
  }, [token, loadDashboard]);

  /* ── destination/point helpers ──────────────────── */
  const selectedDestination = useMemo(
    () => destinations.find((d) => d.id === selectedDestinationId) || destinations[0] || null,
    [destinations, selectedDestinationId]
  );

  const selectedPoint = useMemo(() => {
    if (!selectedDestination) return null;
    return (selectedDestination.points || []).find((p) => p.id === selectedPointId) || (selectedDestination.points || [])[0] || null;
  }, [selectedDestination, selectedPointId]);

  const stats = useMemo(() => {
    const pts = destinations.reduce((s, d) => s + ((d.points || []).length), 0);
    return { destinations: destinations.length, points: pts, bookings: bookings.length };
  }, [destinations, bookings]);

  const patchDestination = (destId, updater) => {
    setCmsData((prev) => ({
      ...prev,
      destinations: prev.destinations.map((d) => d.id !== destId ? d : updater(d)),
    }));
  };

  const patchPoint = (destId, ptId, updater) => {
    patchDestination(destId, (d) => ({
      ...d,
      points: (d.points || []).map((p) => p.id !== ptId ? p : updater(p)),
    }));
  };

  const uploadImage = async (file) => {
    const base64 = await compressImageFile(file);
    const result = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image: base64 }),
    });
    const raw = await result.text();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch (_error) {
      payload = {};
    }
    if (!result.ok) {
      const fallback = result.status === 404
        ? 'Upload endpoint not found. Restart backend server and try again.'
        : `Failed to upload image to server (${result.status}).`;
      throw new Error(payload.error || raw || fallback);
    }
    return payload.url;
  };

  const handleDestinationCardImageUpload = async (file) => {
    if (!selectedDestination || !file) return;
    try {
      const imageData = await uploadImage(file);
      patchDestination(selectedDestination.id, (d) => ({ ...d, cardImage: imageData }));
    } catch (err) {
      setError(err.message || 'Unable to upload destination image.');
    }
  };

  const handlePointCardImageUpload = async (file) => {
    if (!selectedDestination || !selectedPoint || !file) return;
    try {
      const imageData = await uploadImage(file);
      patchPoint(selectedDestination.id, selectedPoint.id, (p) => ({ ...p, cardImage: imageData }));
    } catch (err) {
      setError(err.message || 'Unable to upload point image.');
    }
  };

  const addDestination = () => {
    const id = `destination-${Date.now()}`;
    setCmsData((prev) => ({
      ...prev,
      destinations: [...(prev.destinations || []), { id, name: 'NEW DESTINATION', slug: id, cardImage: '', heroSlides: [], points: [] }],
    }));
    setSelectedDestinationId(id);
    setSelectedPointId('');
  };

  const removeDestination = async () => {
    if (!selectedDestination) return;
    if (!window.confirm(`Delete "${selectedDestination.name}" and all its tourist points, rooms, activities? This cannot be undone.`)) return;

    const newDestinations = (cmsData.destinations || []).filter((d) => d.id !== selectedDestination.id);
    const newCms = { ...cmsData, destinations: newDestinations };

    setCmsData(newCms);
    setSelectedDestinationId(newDestinations[0]?.id || '');
    setSelectedPointId(newDestinations[0]?.points?.[0]?.id || '');
    setDestTab('basic');
    setPointTab('info');

    // Auto-save to persist the deletion
    try {
      setSaving(true); setError(''); setStatus('');
      await updateCms(newCms, token);
      setStatus('Destination deleted and saved successfully!');
    } catch (err) {
      setError(err.message || 'Destination removed locally but failed to save. Click Save to retry.');
    } finally {
      setSaving(false);
    }
  };

  const addPoint = () => {
    if (!selectedDestination) return;
    const id = `point-${Date.now()}`;
    patchDestination(selectedDestination.id, (d) => ({
      ...d,
      points: [...(d.points || []), {
        id, name: 'NEW POINT', slug: id, cardImage: '', heroSlides: [],
        tabs: { infoTitle: '', infoDescription: '', infoBullets: [], infoGallery: [], rooms: [], activities: [], galleryImages: [] },
      }],
    }));
    setSelectedPointId(id);
  };

  const removePoint = () => {
    if (!selectedDestination || !selectedPoint) return;
    patchDestination(selectedDestination.id, (d) => ({
      ...d,
      points: (d.points || []).filter((p) => p.id !== selectedPoint.id),
    }));
    const next = (selectedDestination.points || []).find((p) => p.id !== selectedPoint.id);
    setSelectedPointId(next?.id || '');
  };

  /* ── point tab helpers ──────────────────────────── */
  const patchTabs = (field, value) => {
    if (!selectedDestination || !selectedPoint) return;
    patchPoint(selectedDestination.id, selectedPoint.id, (p) => ({
      ...p,
      tabs: { ...(p.tabs || {}), [field]: value },
    }));
  };

  const uploadTabImages = async (field, files) => {
    if (!files?.length) return;
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadImage));
      const current = cleanLines(selectedPoint?.tabs?.[field] || []);
      patchTabs(field, [...current, ...uploaded]);
    } catch (err) {
      setError(err.message || 'Unable to upload images.');
    }
  };

  const removeTabImageAt = (field, idx) => {
    const current = cleanLines(selectedPoint?.tabs?.[field] || []);
    patchTabs(field, current.filter((_, i) => i !== idx));
  };

  const uploadRoomImages = async (roomIdx, files) => {
    if (!files?.length) return;
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadImage));
      const rooms = selectedPoint?.tabs?.rooms || [];
      const current = cleanLines(Array.isArray(rooms[roomIdx]?.images) ? rooms[roomIdx].images : (rooms[roomIdx]?.image ? [rooms[roomIdx].image] : []));
      updateRoom(roomIdx, 'images', [...current, ...uploaded]);
    } catch (err) {
      setError(err.message || 'Unable to upload room images.');
    }
  };

  const removeRoomImageAt = (roomIdx, imgIdx) => {
    const rooms = selectedPoint?.tabs?.rooms || [];
    const current = cleanLines(Array.isArray(rooms[roomIdx]?.images) ? rooms[roomIdx].images : (rooms[roomIdx]?.image ? [rooms[roomIdx].image] : []));
    updateRoom(roomIdx, 'images', current.filter((_, i) => i !== imgIdx));
  };

  const uploadActivityImageAt = async (activityIdx, imageIdx, file) => {
    if (!file) return;
    try {
      const imageData = await uploadImage(file);
      updateActivityImage(activityIdx, imageIdx, imageData);
    } catch (err) {
      setError(err.message || 'Unable to upload activity image.');
    }
  };

  // rooms
  const addRoom = () => {
    const rooms = [...(selectedPoint?.tabs?.rooms || []), { images: [], title: '', price: '', quantity: '', amenities: [] }];
    patchTabs('rooms', rooms);
  };
  const removeRoom = (idx) => patchTabs('rooms', (selectedPoint?.tabs?.rooms || []).filter((_, i) => i !== idx));
  const updateRoom = (idx, field, val) => {
    patchTabs('rooms', (selectedPoint?.tabs?.rooms || []).map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };
  const addRoomAmenity = (idx) => {
    const rooms = (selectedPoint?.tabs?.rooms || []).map((r, i) => i === idx ? { ...r, amenities: [...(r.amenities || []), { icon: '', label: '' }] } : r);
    patchTabs('rooms', rooms);
  };
  const updateRoomAmenity = (rIdx, aIdx, field, val) => {
    const rooms = (selectedPoint?.tabs?.rooms || []).map((r, ri) => ri === rIdx ? {
      ...r, amenities: (r.amenities || []).map((a, ai) => ai === aIdx ? { ...a, [field]: val } : a)
    } : r);
    patchTabs('rooms', rooms);
  };
  const removeRoomAmenity = (rIdx, aIdx) => {
    const rooms = (selectedPoint?.tabs?.rooms || []).map((r, ri) => ri === rIdx ? {
      ...r, amenities: (r.amenities || []).filter((_, ai) => ai !== aIdx)
    } : r);
    patchTabs('rooms', rooms);
  };

  // activities
  const addActivity = () => {
    patchTabs('activities', [...(selectedPoint?.tabs?.activities || []), { title: '', description: '', images: ['', '', '', '', ''] }]);
  };
  const removeActivity = (idx) => patchTabs('activities', (selectedPoint?.tabs?.activities || []).filter((_, i) => i !== idx));
  const updateActivity = (idx, field, val) => {
    patchTabs('activities', (selectedPoint?.tabs?.activities || []).map((a, i) => i === idx ? { ...a, [field]: val } : a));
  };
  const updateActivityImage = (aIdx, imgIdx, val) => {
    patchTabs('activities', (selectedPoint?.tabs?.activities || []).map((a, i) => {
      if (i !== aIdx) return a;
      const images = [...(a.images || ['', '', '', '', ''])];
      while (images.length < 5) images.push('');
      images[imgIdx] = val;
      return { ...a, images };
    }));
  };

  /* ── actions ───────────────────────────────────── */
  const handleSave = async () => {
    setError(''); setStatus(''); setSaving(true);
    try {
      await updateCms(cmsData, token);
      setStatus('All CMS content saved successfully!');
    } catch (err) { setError(err.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleSeed = async () => {
    setError(''); setStatus('');
    try {
      await seedCms(token);
      await loadDashboard(token);
      setStatus('CMS data seeded successfully.');
    } catch (err) { setError(err.message || 'Failed to seed.'); }
  };

  const handleBookingStatus = async (bookingId, val) => {
    try {
      await updateBookingStatus(bookingId, val, token);
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: val } : b));
      setStatus('Booking status updated.');
      setError('');
    } catch (err) { setError(err.message); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); setError(''); setStatus('');
    try {
      const su = username.trim(); const sp = password.trim();
      if (!su || !sp) throw new Error('Please enter username and password.');
      const result = await adminLogin(su, sp);
      localStorage.setItem('admin_token', result.token);
      setToken(result.token);
      setUsername(''); setPassword('');
    } catch (err) { setError(err.message || 'Login failed.'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setCmsData({ destinations: [], homePage: {} });
    setBookings([]);
    setActiveNav('dashboard');
  };

  const navTo = (id) => { setActiveNav(id); setSidebarOpen(false); };

  /* ── LOGIN SCREEN ──────────────────────────────── */
  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="login-logo">APEX</div>
          <h1>Admin Panel</h1>
          <p>Sign in to manage your content</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loginLoading}>{loginLoading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          {error && <p className="toast error">{error}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-loader">
          <div className="loader-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* ── SECTION RENDERS ───────────────────────────── */

  const renderDashboard = () => (
    <div className="panel-section dashboard-panel">
      <h2 className="section-title">Dashboard Overview</h2>
      <p className="section-desc dashboard-desc">Live snapshot of your content with quick admin actions.</p>
      <div className="stats-grid">
        <div className="stat-card blue"><span className="stat-icon">🏔️</span><div className="stat-content"><div className="stat-number">{stats.destinations}</div><div className="stat-label">Destinations</div></div></div>
        <div className="stat-card green"><span className="stat-icon">📍</span><div className="stat-content"><div className="stat-number">{stats.points}</div><div className="stat-label">Tourist Points</div></div></div>
        <div className="stat-card orange"><span className="stat-icon">📋</span><div className="stat-content"><div className="stat-number">{stats.bookings}</div><div className="stat-label">Bookings</div></div></div>
      </div>
      <div className="quick-actions">
        <button className="btn primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save All Changes'}</button>
        <button className="btn outline" onClick={handleSeed}>🌱 Seed Default Data</button>
        <button className="btn outline" onClick={() => loadDashboard(token)}>🔄 Refresh Data</button>
      </div>
    </div>
  );

  const renderHeroSection = () => {
    const hero = homePage.hero || {};
    return (
      <div className="panel-section">
        <h2 className="section-title">🖼️ Hero Section</h2>
        <p className="section-desc">Manage the homepage hero slider, title, and contact buttons.</p>
        <div className="form-grid">
          <div className="form-group full">
            <label>Hero Title</label>
            <textarea rows={3} value={hero.title || ''} onChange={(e) => patchHomeNested('hero', 'title', e.target.value)} placeholder="CHECK IN TO THE\nTIME OF YOUR LIFE" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={hero.phone || ''} onChange={(e) => patchHomeNested('hero', 'phone', e.target.value)} placeholder="+923001234567" />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input value={hero.whatsapp || ''} onChange={(e) => patchHomeNested('hero', 'whatsapp', e.target.value)} placeholder="+923001234567" />
          </div>
          <div className="form-group full">
            <label>Hero Slides (one image URL per line)</label>
            <textarea rows={6} value={joinLines(hero.slides || [])} onChange={(e) => patchHomeNested('hero', 'slides', splitLines(e.target.value))} placeholder="https://images.unsplash.com/..." />
          </div>
          {(hero.slides || []).length > 0 && (
            <div className="image-preview-grid full">
              {cleanLines(hero.slides).map((url, i) => (
                <div key={i} className="img-thumb"><img src={url} alt={`Slide ${i + 1}`} /><span>Slide {i + 1}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTravelSection = () => {
    const travel = homePage.travel || {};
    return (
      <div className="panel-section">
        <h2 className="section-title">✈️ Travel Section</h2>
        <p className="section-desc">Edit the travel section content and image shown on the homepage.</p>
        <div className="form-grid">
          <div className="form-group full">
            <label>Title</label>
            <input value={travel.title || ''} onChange={(e) => patchHomeNested('travel', 'title', e.target.value)} />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea rows={4} value={travel.description || ''} onChange={(e) => patchHomeNested('travel', 'description', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Button Text</label>
            <input value={travel.buttonText || ''} onChange={(e) => patchHomeNested('travel', 'buttonText', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={travel.image || ''} onChange={(e) => patchHomeNested('travel', 'image', e.target.value)} />
          </div>
          {travel.image && (
            <div className="image-preview-grid full">
              <div className="img-thumb large"><img src={travel.image} alt="Travel" /></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLocations = () => {
    const locs = homePage.locations || [];
    const updateLoc = (idx, field, value) => {
      const updated = locs.map((l, i) => i === idx ? { ...l, [field]: value } : l);
      patchHome('locations', updated);
    };
    const addLoc = () => patchHome('locations', [...locs, { id: Date.now(), name: '', location: '', image: '' }]);
    const removeLoc = (idx) => patchHome('locations', locs.filter((_, i) => i !== idx));

    return (
      <div className="panel-section">
        <h2 className="section-title">📍 Our Locations</h2>
        <p className="section-desc">Manage the hotel cards displayed in the locations slider.</p>
        <div className="items-list">
          {locs.map((loc, idx) => (
            <div key={loc.id || idx} className="item-card">
              <div className="item-card-header">
                <span className="item-num">#{idx + 1}</span>
                <button className="btn-icon danger" onClick={() => removeLoc(idx)} title="Remove">✕</button>
              </div>
              {loc.image && <img src={loc.image} alt={loc.name} className="item-card-img" />}
              <div className="form-grid compact">
                <div className="form-group"><label>Name</label><input value={loc.name || ''} onChange={(e) => updateLoc(idx, 'name', e.target.value)} /></div>
                <div className="form-group"><label>Location</label><input value={loc.location || ''} onChange={(e) => updateLoc(idx, 'location', e.target.value)} /></div>
                <div className="form-group full"><label>Image URL</label><input value={loc.image || ''} onChange={(e) => updateLoc(idx, 'image', e.target.value)} /></div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn outline" onClick={addLoc}>+ Add Location</button>
      </div>
    );
  };

  const renderDining = () => {
    const items = homePage.dining || [];
    const updateItem = (idx, field, value) => {
      patchHome('dining', items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };
    const addItem = () => patchHome('dining', [...items, { id: Date.now(), name: '', description: '', image: '' }]);
    const removeItem = (idx) => patchHome('dining', items.filter((_, i) => i !== idx));

    return (
      <div className="panel-section">
        <h2 className="section-title">🍽️ Dine In Section</h2>
        <p className="section-desc">Manage restaurants displayed on the homepage.</p>
        <div className="items-list">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="item-card">
              <div className="item-card-header">
                <span className="item-num">#{idx + 1}</span>
                <button className="btn-icon danger" onClick={() => removeItem(idx)} title="Remove">✕</button>
              </div>
              {item.image && <img src={item.image} alt={item.name} className="item-card-img" />}
              <div className="form-grid compact">
                <div className="form-group"><label>Name</label><input value={item.name || ''} onChange={(e) => updateItem(idx, 'name', e.target.value)} /></div>
                <div className="form-group"><label>Subtitle</label><input value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} /></div>
                <div className="form-group full"><label>Image URL</label><input value={item.image || ''} onChange={(e) => updateItem(idx, 'image', e.target.value)} /></div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn outline" onClick={addItem}>+ Add Restaurant</button>
      </div>
    );
  };

  const renderOffers = () => {
    const offers = homePage.offersBanner || {};
    return (
      <div className="panel-section">
        <h2 className="section-title">🏷️ Offers Banner</h2>
        <p className="section-desc">Edit the promotional banner text and button.</p>
        <div className="form-grid">
          <div className="form-group full"><label>Title</label><textarea rows={2} value={offers.title || ''} onChange={(e) => patchHomeNested('offersBanner', 'title', e.target.value)} /></div>
          <div className="form-group full"><label>Description</label><input value={offers.description || ''} onChange={(e) => patchHomeNested('offersBanner', 'description', e.target.value)} /></div>
          <div className="form-group"><label>Button Text</label><input value={offers.buttonText || ''} onChange={(e) => patchHomeNested('offersBanner', 'buttonText', e.target.value)} /></div>
        </div>
      </div>
    );
  };

  const renderAppSection = () => {
    const app = homePage.appSection || {};
    return (
      <div className="panel-section">
        <h2 className="section-title">📱 App Section</h2>
        <p className="section-desc">Edit the mobile app promotion section.</p>
        <div className="form-grid">
          <div className="form-group full"><label>Title</label><input value={app.title || ''} onChange={(e) => patchHomeNested('appSection', 'title', e.target.value)} /></div>
          <div className="form-group full"><label>Description</label><textarea rows={3} value={app.description || ''} onChange={(e) => patchHomeNested('appSection', 'description', e.target.value)} /></div>
        </div>
      </div>
    );
  };

  const renderContact = () => {
    const contact = homePage.contact || {};
    return (
      <div className="panel-section">
        <h2 className="section-title">📞 Contact Info</h2>
        <p className="section-desc">Update contact details shown on the homepage.</p>
        <div className="form-grid">
          <div className="form-group"><label>Phone</label><input value={contact.phone || ''} onChange={(e) => patchHomeNested('contact', 'phone', e.target.value)} /></div>
          <div className="form-group"><label>Email</label><input value={contact.email || ''} onChange={(e) => patchHomeNested('contact', 'email', e.target.value)} /></div>
          <div className="form-group full"><label>Form Heading</label><input value={contact.formTitle || ''} onChange={(e) => patchHomeNested('contact', 'formTitle', e.target.value)} /></div>
        </div>
      </div>
    );
  };

  const renderDestinations = () => {
    const DEST_TABS = [
      { id: 'basic', label: 'Basic Info' },
      { id: 'points', label: 'Tourist Points' },
    ];
    const POINT_TABS = [
      { id: 'info', label: 'Information' },
      { id: 'rooms', label: 'Rooms' },
      { id: 'activities', label: 'Activities' },
      { id: 'gallery', label: 'Gallery & Images' },
    ];

    const tabs = selectedPoint?.tabs || {};

    /* ── Information sub-tab ── */
    const renderInfoTab = () => (
      <div className="sub-tab-content">
        <div className="form-grid">
          <div className="form-group full">
            <label>Description</label>
            <textarea rows={5} value={tabs.infoDescription || ''} onChange={(e) => patchTabs('infoDescription', e.target.value)} placeholder="Describe this tourist point..." />
          </div>
          <div className="form-group full">
            <label>Highlights / Bullets (one per line)</label>
            <textarea rows={4} value={joinLines(tabs.infoBullets || [])} onChange={(e) => patchTabs('infoBullets', splitLines(e.target.value))} placeholder="Comfortable Rooms & Eco-Friendly&#10;Resort Located 8 Minutes from Airport&#10;Beautiful Mountain Views" />
          </div>
          <div className="form-group full">
            <label>Information Images (3 recommended)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                await uploadTabImages('infoGallery', e.target.files);
                e.target.value = '';
              }}
            />
          </div>
          {(tabs.infoGallery || []).length > 0 && (
            <div className="image-preview-grid full">
              {cleanLines(tabs.infoGallery).map((url, i) => (
                <div key={i} className="img-thumb">
                  <img src={url} alt={`Info ${i + 1}`} />
                  <span>Image {i + 1}{getBase64SizeMb(url) ? ` · ${getBase64SizeMb(url)}` : ''}</span>
                  <button className="btn-icon danger" type="button" onClick={() => removeTabImageAt('infoGallery', i)}>✕</button>
                </div>
              ))}
            </div>
          )}
          {cleanLines(tabs.infoGallery).length > 0 && (
            <div className="form-group full">
              <button className="btn small outline" type="button" onClick={() => patchTabs('infoGallery', [])}>
                Remove All Information Images
              </button>
            </div>
          )}
        </div>
      </div>
    );

    /* ── Rooms sub-tab ── */
    const renderRoomsTab = () => {
      const rooms = tabs.rooms || [];
      return (
        <div className="sub-tab-content">
          {rooms.map((room, rIdx) => (
            <div key={rIdx} className="nested-card">
              <div className="nested-card-header">
                <span className="item-num">Room #{rIdx + 1}</span>
                <button className="btn-icon danger" onClick={() => removeRoom(rIdx)} title="Remove Room">✕</button>
              </div>

              <div className="form-grid compact">
                <div className="form-group full">
                  <label>Room Title</label>
                  <input value={room.title || ''} onChange={(e) => updateRoom(rIdx, 'title', e.target.value)} placeholder="Deluxe Master Room" />
                </div>
                <div className="form-group">
                  <label>Price (PKR)</label>
                  <input value={room.price || ''} onChange={(e) => updateRoom(rIdx, 'price', e.target.value)} placeholder="14,000" />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input value={room.quantity || ''} onChange={(e) => updateRoom(rIdx, 'quantity', e.target.value)} placeholder="05" />
                </div>

                {/* Room Images */}
                <div className="form-group full">
                  <label>Room Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      await uploadRoomImages(rIdx, e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
                {cleanLines(Array.isArray(room.images) ? room.images : (room.image ? [room.image] : [])).length > 0 && (
                  <div className="image-preview-grid full">
                    {cleanLines(Array.isArray(room.images) ? room.images : [room.image]).map((url, i) => (
                      <div key={i} className="img-thumb">
                        <img src={url} alt={`Room ${rIdx + 1} img ${i + 1}`} />
                        <span>Img {i + 1}{getBase64SizeMb(url) ? ` · ${getBase64SizeMb(url)}` : ''}</span>
                        <button className="btn-icon danger" type="button" onClick={() => removeRoomImageAt(rIdx, i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {cleanLines(Array.isArray(room.images) ? room.images : (room.image ? [room.image] : [])).length > 0 && (
                  <div className="form-group full">
                    <button className="btn small outline" type="button" onClick={() => updateRoom(rIdx, 'images', [])}>
                      Remove All Room Images
                    </button>
                  </div>
                )}

                {/* Facilities / Amenities */}
                <div className="form-group full">
                  <label>Facilities / Amenities</label>
                  <div className="amenities-list">
                    {(room.amenities || []).map((am, aIdx) => (
                      <div key={aIdx} className="amenity-row">
                        <input className="amenity-icon-input" value={am.icon || ''} onChange={(e) => updateRoomAmenity(rIdx, aIdx, 'icon', e.target.value)} placeholder="🍳" />
                        <input className="amenity-label-input" value={am.label || ''} onChange={(e) => updateRoomAmenity(rIdx, aIdx, 'label', e.target.value)} placeholder="Free Breakfast" />
                        <button className="btn-icon danger small" onClick={() => removeRoomAmenity(rIdx, aIdx)} title="Remove">✕</button>
                      </div>
                    ))}
                    <button className="btn small outline" onClick={() => addRoomAmenity(rIdx)}>+ Add Facility</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="btn outline" onClick={addRoom}>+ Add Room</button>
        </div>
      );
    };

    /* ── Activities sub-tab ── */
    const renderActivitiesTab = () => {
      const activities = tabs.activities || [];
      return (
        <div className="sub-tab-content">
          {activities.map((act, aIdx) => (
            <div key={aIdx} className="nested-card">
              <div className="nested-card-header">
                <span className="item-num">Activity #{aIdx + 1}</span>
                <button className="btn-icon danger" onClick={() => removeActivity(aIdx)} title="Remove Activity">✕</button>
              </div>
              <div className="form-grid compact">
                <div className="form-group full">
                  <label>Title</label>
                  <input value={act.title || ''} onChange={(e) => updateActivity(aIdx, 'title', e.target.value)} placeholder="#WhatAwaitsYou" />
                </div>
                <div className="form-group full">
                  <label>Description</label>
                  <textarea rows={3} value={act.description || ''} onChange={(e) => updateActivity(aIdx, 'description', e.target.value)} />
                </div>
                <div className="form-group full">
                  <label>5 Activity Images (mandatory)</label>
                  <div className="activity-images-grid">
                    {[0, 1, 2, 3, 4].map((imgIdx) => {
                      const imgUrl = (act.images || [])[imgIdx] || '';
                      return (
                        <div key={imgIdx} className="activity-img-slot">
                          <label>Image {imgIdx + 1} {!imgUrl && <span className="required">*</span>}</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              await uploadActivityImageAt(aIdx, imgIdx, e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                          {imgUrl && (
                            <button className="btn small outline" type="button" onClick={() => updateActivityImage(aIdx, imgIdx, '')}>
                              Remove Image
                            </button>
                          )}
                          {imgUrl && <img src={imgUrl} alt={`Act ${aIdx + 1} img ${imgIdx + 1}`} className="activity-img-preview" />}
                          {imgUrl && getBase64SizeMb(imgUrl) && <span className="img-size-label">{getBase64SizeMb(imgUrl)}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="btn outline" onClick={addActivity}>+ Add Activity</button>
        </div>
      );
    };

    /* ── Gallery sub-tab ── */
    const renderGalleryTab = () => (
      <div className="sub-tab-content">
        <div className="form-grid">
          <div className="form-group full">
            <label>Gallery Title</label>
            <input value={tabs.galleryTitle || ''} onChange={(e) => patchTabs('galleryTitle', e.target.value)} placeholder="GALLERY & IMAGES" />
          </div>
          <div className="form-group full">
            <label>Gallery Description</label>
            <textarea rows={3} value={tabs.galleryDescription || ''} onChange={(e) => patchTabs('galleryDescription', e.target.value)} placeholder="Explore our beautiful destination..." />
          </div>
          <div className="form-group full">
            <label>Gallery / Hero Images (used in destination hero)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                await uploadTabImages('galleryImages', e.target.files);
                e.target.value = '';
              }}
            />
          </div>
          {(tabs.galleryImages || []).length > 0 && (
            <div className="image-preview-grid full">
              {cleanLines(tabs.galleryImages).map((url, i) => (
                <div key={i} className="img-thumb">
                  <img src={url} alt={`Gallery ${i + 1}`} />
                  <span>Gallery {i + 1}{getBase64SizeMb(url) ? ` · ${getBase64SizeMb(url)}` : ''}</span>
                  <button className="btn-icon danger" type="button" onClick={() => removeTabImageAt('galleryImages', i)}>✕</button>
                </div>
              ))}
            </div>
          )}
          {cleanLines(tabs.galleryImages).length > 0 && (
            <div className="form-group full">
              <button className="btn small outline" type="button" onClick={() => patchTabs('galleryImages', [])}>
                Remove All Gallery Images
              </button>
            </div>
          )}
        </div>
      </div>
    );

    /* ── Points panel ── */
    const renderPointsPanel = () => {
      if (!selectedDestination) return <p className="empty-msg">Select a destination first.</p>;
      const points = selectedDestination.points || [];

      return (
        <div className="points-section">
          <div className="dest-panel-head">
            <h3>Tourist Points ({points.length})</h3>
            <button className="btn small primary" onClick={addPoint}>+ Add Point</button>
          </div>

          {points.length === 0 ? (
            <p className="empty-msg">No tourist points added yet. Add one above or leave blank.</p>
          ) : (
            <>
              <div className="point-selector">
                <select value={selectedPoint?.id || ''} onChange={(e) => { setSelectedPointId(e.target.value); setPointTab('info'); }}>
                  {points.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {selectedPoint && (
                <div className="point-editor">
                  {/* Point basic info */}
                  <div className="form-grid compact" style={{ marginBottom: 16 }}>
                    <div className="form-group">
                      <label>Point Name</label>
                      <input value={selectedPoint.name || ''} onChange={(e) => { const name = e.target.value; patchPoint(selectedDestination.id, selectedPoint.id, (p) => ({ ...p, name, slug: toSlug(name) })); }} />
                    </div>
                    <div className="form-group">
                      <label>Slug</label>
                      <input value={selectedPoint.slug || ''} onChange={(e) => patchPoint(selectedDestination.id, selectedPoint.id, (p) => ({ ...p, slug: toSlug(e.target.value) }))} />
                    </div>
                    <div className="form-group full">
                      <label>Card Image Upload</label>
                      <input type="file" accept="image/*" onChange={(e) => handlePointCardImageUpload(e.target.files?.[0])} />
                      {!!selectedPoint.cardImage && (
                        <button className="btn small outline" type="button" onClick={() => patchPoint(selectedDestination.id, selectedPoint.id, (p) => ({ ...p, cardImage: '' }))}>
                          Remove Current Image
                        </button>
                      )}
                    </div>
                    {!!selectedPoint.cardImage && (
                      <div className="image-preview-grid full">
                        <div className="img-thumb large">
                          <img src={selectedPoint.cardImage} alt="Point card" />
                          {getBase64SizeMb(selectedPoint.cardImage) && <span>{getBase64SizeMb(selectedPoint.cardImage)}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4 content tabs */}
                  <div className="inner-tabs">
                    {POINT_TABS.map((t) => (
                      <button key={t.id} className={`inner-tab${pointTab === t.id ? ' active' : ''}`} onClick={() => setPointTab(t.id)}>{t.label}</button>
                    ))}
                  </div>

                  <div className="inner-tab-body">
                    {pointTab === 'info' && renderInfoTab()}
                    {pointTab === 'rooms' && renderRoomsTab()}
                    {pointTab === 'activities' && renderActivitiesTab()}
                    {pointTab === 'gallery' && renderGalleryTab()}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <button className="btn small danger" onClick={removePoint}>Delete This Point</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      );
    };

    return (
      <div className="panel-section">
        <h2 className="section-title">🏔️ Destinations</h2>
        <p className="section-desc">Manage resort destinations and tourist points with their content tabs.</p>

        {/* Destination selector */}
        <div className="dest-selector-bar">
          <select value={selectedDestination?.id || ''} onChange={(e) => {
            setSelectedDestinationId(e.target.value);
            const nd = destinations.find((d) => d.id === e.target.value);
            setSelectedPointId(nd?.points?.[0]?.id || '');
            setDestTab('basic');
            setPointTab('info');
          }}>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button className="btn small primary" onClick={addDestination}>+ New Destination</button>
        </div>

        {selectedDestination && (
          <>
            {/* Destination-level tabs */}
            <div className="inner-tabs dest-level-tabs">
              {DEST_TABS.map((t) => (
                <button key={t.id} className={`inner-tab${destTab === t.id ? ' active' : ''}`} onClick={() => setDestTab(t.id)}>{t.label}</button>
              ))}
            </div>

            {destTab === 'basic' && (
              <div className="inner-tab-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Destination Name</label>
                    <input value={selectedDestination.name || ''} onChange={(e) => { const name = e.target.value; patchDestination(selectedDestination.id, (d) => ({ ...d, name, slug: toSlug(name) })); }} />
                  </div>
                  <div className="form-group">
                    <label>Slug</label>
                    <input value={selectedDestination.slug || ''} onChange={(e) => patchDestination(selectedDestination.id, (d) => ({ ...d, slug: toSlug(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label>Card Image Upload</label>
                    <input type="file" accept="image/*" onChange={(e) => handleDestinationCardImageUpload(e.target.files?.[0])} />
                    {!!selectedDestination.cardImage && (
                      <button className="btn small outline" type="button" onClick={() => patchDestination(selectedDestination.id, (d) => ({ ...d, cardImage: '' }))}>
                        Remove Current Image
                      </button>
                    )}
                  </div>
                  {selectedDestination.cardImage && (
                    <div className="image-preview-grid full">
                      <div className="img-thumb large">
                        <img src={selectedDestination.cardImage} alt="Card" />
                        {getBase64SizeMb(selectedDestination.cardImage) && <span>{getBase64SizeMb(selectedDestination.cardImage)}</span>}
                      </div>
                    </div>
                  )}
                  <div className="form-group full">
                    <label>Hero Slides (one URL per line)</label>
                    <textarea rows={4} value={joinLines(selectedDestination.heroSlides || [])} onChange={(e) => patchDestination(selectedDestination.id, (d) => ({ ...d, heroSlides: splitLines(e.target.value) }))} />
                  </div>
                  {(selectedDestination.heroSlides || []).length > 0 && (
                    <div className="image-preview-grid full">
                      {cleanLines(selectedDestination.heroSlides).map((url, i) => (
                        <div key={i} className="img-thumb"><img src={url} alt={`Slide ${i + 1}`} /><span>Slide {i + 1}</span></div>
                      ))}
                    </div>
                  )}
                  <div className="form-group full">
                    <button className="btn small danger" onClick={removeDestination}>Delete This Destination</button>
                  </div>
                </div>
              </div>
            )}

            {destTab === 'points' && (
              <div className="inner-tab-body">
                {renderPointsPanel()}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderBookings = () => {
    const q = bookingSearch.toLowerCase();
    const filtered = bookings.filter((b) => {
      if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
      if (q && !(
        (b.fullName || '').toLowerCase().includes(q) ||
        (b.email || '').toLowerCase().includes(q) ||
        (b.mobile || '').toLowerCase().includes(q) ||
        (b.roomName || '').toLowerCase().includes(q) ||
        (b.resortName || '').toLowerCase().includes(q)
      )) return false;
      return true;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / BOOKINGS_PER_PAGE));
    const safePage = Math.min(bookingPage, totalPages);
    const paged = filtered.slice((safePage - 1) * BOOKINGS_PER_PAGE, safePage * BOOKINGS_PER_PAGE);

    return (
      <div className="panel-section">
        <h2 className="section-title">📋 Bookings</h2>

        {/* toolbar */}
        <div className="booking-toolbar">
          <input className="booking-search" placeholder="Search name, email, mobile, room..." value={bookingSearch} onChange={(e) => { setBookingSearch(e.target.value); setBookingPage(1); }} />
          <select className="booking-filter" value={bookingFilter} onChange={(e) => { setBookingFilter(e.target.value); setBookingPage(1); }}>
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="email_failed">Email Failed</option>
          </select>
          <span className="booking-count">{filtered.length} of {bookings.length} bookings</span>
          <button className="btn small outline" onClick={() => loadDashboard(token)}>Refresh</button>
        </div>

        {paged.length === 0 ? <p className="empty-msg">No bookings match your filters.</p> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Guest</th><th>Mobile</th><th>Email</th><th>Room</th><th>Resort</th><th>Dates</th><th>Persons</th><th>Status</th></tr>
              </thead>
              <tbody>
                {paged.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.fullName}</strong></td>
                    <td className="nowrap">{b.mobile || '—'}</td>
                    <td>{b.email}</td>
                    <td>{b.roomName}</td>
                    <td>{b.resortName}</td>
                    <td className="nowrap">{b.dateFrom} → {b.dateTo}</td>
                    <td>{b.persons || '—'}</td>
                    <td>
                      <select className={`status-select ${b.status}`} value={b.status} onChange={(e) => handleBookingStatus(b.id, e.target.value)}>
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="email_failed">Email Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="booking-pagination">
            <button className="btn small" disabled={safePage <= 1} onClick={() => setBookingPage(safePage - 1)}>← Prev</button>
            <span className="page-info">Page {safePage} of {totalPages}</span>
            <button className="btn small" disabled={safePage >= totalPages} onClick={() => setBookingPage(safePage + 1)}>Next →</button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard': return renderDashboard();
      case 'home-hero': return renderHeroSection();
      case 'home-travel': return renderTravelSection();
      case 'home-locations': return renderLocations();
      case 'home-dining': return renderDining();
      case 'home-offers': return renderOffers();
      case 'home-app': return renderAppSection();
      case 'home-contact': return renderContact();
      case 'destinations': return renderDestinations();
      case 'bookings': return renderBookings();
      default: return renderDashboard();
    }
  };

  /* ── MAIN LAYOUT ───────────────────────────────── */
  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-logo">APEX</span>
          <span className="brand-sub">CMS Panel</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} className={`nav-item${activeNav === item.id ? ' active' : ''}`} onClick={() => navTo(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn danger full" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span /><span /><span />
          </button>
          <h1 className="topbar-title">{NAV_ITEMS.find((n) => n.id === activeNav)?.label || 'Dashboard'}</h1>
          <div className="topbar-actions">
            <button className="btn primary compact" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
          {status && <div className="toast success" onClick={() => setStatus('')}>{status}</div>}
          {error && <div className="toast error" onClick={() => setError('')}>{error}</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminCMS;
