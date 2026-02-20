import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './Listings.css';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: '',
    sortBy: 'newest'
  });

  // Sample property data (in a real app, this would come from an API)
  const allProperties = [
    {
      id: 1,
      title: 'Spacious Room in DHA Phase 5',
      location: 'DHA Phase 5, Karachi',
      price: '25,000',
      type: 'Room',
      beds: 1,
      baths: 1,
      area: '150 sq ft',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
      city: 'karachi'
    },
    {
      id: 2,
      title: 'Luxury Apartment in Bahria Town',
      location: 'Bahria Town, Lahore',
      price: '45,000',
      type: 'Apartment',
      beds: 2,
      baths: 2,
      area: '1000 sq ft',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      city: 'lahore'
    },
    {
      id: 3,
      title: 'Cozy Room Near University',
      location: 'Gulberg, Lahore',
      price: '18,000',
      type: 'Room',
      beds: 1,
      baths: 1,
      area: '120 sq ft',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500',
      city: 'lahore'
    },
    {
      id: 4,
      title: 'Modern Flat in F-11',
      location: 'F-11, Islamabad',
      price: '35,000',
      type: 'Apartment',
      beds: 1,
      baths: 1,
      area: '650 sq ft',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
      city: 'islamabad'
    },
    {
      id: 5,
      title: 'Student Room in Saddar',
      location: 'Saddar, Karachi',
      price: '15,000',
      type: 'Room',
      beds: 1,
      baths: 1,
      area: '100 sq ft',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
      city: 'karachi'
    },
    {
      id: 6,
      title: 'Premium Room in Model Town',
      location: 'Model Town, Lahore',
      price: '30,000',
      type: 'Room',
      beds: 1,
      baths: 1,
      area: '200 sq ft',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500',
      city: 'lahore'
    },
    {
      id: 7,
      title: 'Beautiful House in Gulshan',
      location: 'Gulshan-e-Iqbal, Karachi',
      price: '55,000',
      type: 'House',
      beds: 3,
      baths: 2,
      area: '1500 sq ft',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500',
      city: 'karachi'
    },
    {
      id: 8,
      title: 'Studio Apartment in Blue Area',
      location: 'Blue Area, Islamabad',
      price: '28,000',
      type: 'Studio',
      beds: 1,
      baths: 1,
      area: '400 sq ft',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      city: 'islamabad'
    },
    {
      id: 9,
      title: 'Affordable Room in Saddar',
      location: 'Saddar, Rawalpindi',
      price: '12,000',
      type: 'Room',
      beds: 1,
      baths: 1,
      area: '90 sq ft',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
      city: 'rawalpindi'
    },
    {
      id: 10,
      title: 'Luxurious Apartment in DHA',
      location: 'DHA Phase 6, Karachi',
      price: '65,000',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '1800 sq ft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
      city: 'karachi'
    },
    {
      id: 11,
      title: 'Comfortable Room in Johar Town',
      location: 'Johar Town, Lahore',
      price: '22,000',
      type: 'Room',
      beds: 1,
      baths: 1,
      area: '140 sq ft',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500',
      city: 'lahore'
    },
    {
      id: 12,
      title: 'Modern House in F-10',
      location: 'F-10, Islamabad',
      price: '80,000',
      type: 'House',
      beds: 4,
      baths: 3,
      area: '2500 sq ft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      city: 'islamabad'
    }
  ];

  const [filteredProperties, setFilteredProperties] = useState(allProperties);

  useEffect(() => {
    let results = [...allProperties];

    if (filters.city) {
      results = results.filter(p => p.city === filters.city);
    }

    if (filters.type) {
      results = results.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.beds) {
      results = results.filter(p => p.beds >= parseInt(filters.beds));
    }

    setFilteredProperties(results);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      sortBy: 'newest'
    });
  };

  return (
    <div className="listings-page">
      <div className="listings-header">
        <div className="container">
          <h1>Find Your Perfect Property</h1>
          <p>{filteredProperties.length} properties available</p>
        </div>
      </div>

      <div className="container">
        <div className="listings-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">Clear All</button>
            </div>

            <div className="filter-group">
              <label>City</label>
              <select name="city" value={filters.city} onChange={handleFilterChange}>
                <option value="">All Cities</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="faisalabad">Faisalabad</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Property Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="room">Room</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Bedrooms</label>
              <select name="beds" value={filters.beds} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range (PKR)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="listings-content">
            {filteredProperties.length > 0 ? (
              <div className="properties-grid">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No properties found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
