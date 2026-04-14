# Roomy.pk - Property Rental Platform

A modern, responsive React-based property rental platform for Pakistan, helping users find rooms and properties across major cities.

## Features

- 🏠 **Property Listings**: Browse thousands of verified properties
- 🔍 **Advanced Search**: Filter by city, type, price, bedrooms, and more
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 📝 **Post Property**: Easy-to-use form for listing your property
- 🗺️ **City-based Search**: Explore properties by different cities
- 💬 **Contact Owners**: Direct communication with property owners
- ✨ **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **React** 18.2.0
- **React Router** 6.20.0
- **CSS3** for styling
- **React Scripts** 5.0.1

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd roomy
```

2. Install dependencies
```bash
npm install
```

3. Start frontend + backend together
```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Runs frontend (3000) and backend (5001) together
- `npm start` - Runs the app in development mode
- `npm run server` - Runs the Express SMTP/CMS backend on port 5001
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## CMS + Admin Panel

The project now supports a dynamic destination CMS backed by JSON data and admin APIs.

- Public CMS endpoint: `GET /api/cms`
- Admin CMS save endpoint: `PUT /api/admin/cms` (requires `x-admin-key`)
- Admin bookings endpoint: `GET /api/admin/bookings` (requires `x-admin-key`)
- Admin booking status update: `PATCH /api/admin/bookings/:id/status` (requires `x-admin-key`)

### Run locally

1. Start both services with one command (recommended):

```bash
npm run dev
```

2. Or run backend and frontend in separate terminals:

```bash
npm run server
```

```bash
npm start
```

### Admin UI

- Open `http://localhost:3000/admin/cms`
- Paste your `ADMIN_API_KEY`
- Edit JSON to manage:
	- Explore destination cards
	- Small tourist point cards under each destination
	- Hero slides and tab content (info, rooms, activities, gallery)

### Data Source

- CMS data file: `server/data/cms.json`
- Bookings log file: `server/data/bookings.json`

Both are local data files (ignored by git).

## Project Structure

```
roomy/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── SearchBar/
│   │   └── PropertyCard/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Listings/
│   │   ├── PropertyDetail/
│   │   ├── PostProperty/
│   │   ├── About/
│   │   └── Contact/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## Pages

1. **Home** - Landing page with hero section, featured properties, and city explorer
2. **Listings** - Property listings with advanced filters
3. **Property Detail** - Detailed property information with image gallery
4. **Post Property** - Form to list new properties
5. **About** - Information about the platform
6. **Contact** - Contact form and company information

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Image upload functionality
- [ ] Favorites/Wishlist feature
- [ ] Real-time messaging between users
- [ ] Google Maps integration
- [ ] Payment gateway integration
- [ ] Reviews and ratings
- [ ] Backend API integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
