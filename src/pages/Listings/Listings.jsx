import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { fetchCms } from '../../services/cmsApi';
import './Listings.css';
import BannerSection from '../../components/BannerSection/BannerSection';

const toSlug = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '-');

const parsePrice = (value) => {
  const numeric = Number(String(value || '').replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

const formatPrice = (value) => {
  const parsed = parsePrice(value);
  return parsed ? parsed.toLocaleString('en-PK') : 'Contact';
};

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    facility: '',
    sortBy: 'newest'
  });
  const [cmsDestinations, setCmsDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      try {
        setLoading(true);
        setLoadError('');
        const cms = await fetchCms();
        if (!isMounted) return;
        setCmsDestinations(Array.isArray(cms?.destinations) ? cms.destinations : []);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error?.message || 'Failed to load listings.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadListings();
    return () => {
      isMounted = false;
    };
  }, []);

  const resolveRooms = (destination) => {
    if (Array.isArray(destination?.destinationRooms) && destination.destinationRooms.length > 0) {
      return destination.destinationRooms;
    }

    const fallbackTabs = destination?.points?.[0]?.tabs;
    if (Array.isArray(fallbackTabs?.rooms) && fallbackTabs.rooms.length > 0) {
      return fallbackTabs.rooms;
    }

    return [];
  };

  const allProperties = useMemo(() => {
    return cmsDestinations.flatMap((destination) => {
      const destinationName = destination?.name || 'Unknown Destination';
      const destinationSlug = destination?.slug || toSlug(destinationName);
      const rooms = resolveRooms(destination);

      return rooms.map((room, index) => {
        const amenities = Array.isArray(room?.amenities)
          ? room.amenities.map((a) => String(a?.label || '').trim()).filter(Boolean)
          : [];
        const roomImages = Array.isArray(room?.images) ? room.images.filter(Boolean) : [];
        const image = roomImages[0] || destination?.cardImage || destination?.heroSlides?.[0] || '';
        const quantity = Number.parseInt(room?.quantity, 10);

        return {
          id: `${destinationSlug}-${index}`,
          title: room?.title || `${destinationName} Hotel Room`,
          location: destinationName,
          price: formatPrice(room?.price),
          priceValue: parsePrice(room?.price),
          type: 'Hotel',
          beds: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
          baths: 1,
          area: amenities.slice(0, 2).join(' • ') || 'Hotel Room',
          image,
          destination: destinationSlug,
          facilities: amenities,
        };
      });
    });
  }, [cmsDestinations]);

  const destinationOptions = useMemo(() => {
    const map = new Map();
    allProperties.forEach((property) => {
      if (!property.destination) return;
      if (!map.has(property.destination)) {
        map.set(property.destination, property.location);
      }
    });

    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allProperties]);

  const facilityOptions = useMemo(() => {
    const set = new Set();
    allProperties.forEach((property) => {
      (property.facilities || []).forEach((facility) => {
        if (facility) set.add(facility);
      });
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProperties]);

  const filteredProperties = useMemo(() => {
    const minPrice = Number(filters.minPrice || 0);
    const maxPrice = Number(filters.maxPrice || 0);

    let results = [...allProperties];

    if (filters.destination) {
      results = results.filter((property) => property.destination === filters.destination);
    }

    if (filters.facility) {
      const selectedFacility = filters.facility.toLowerCase();
      results = results.filter((property) =>
        (property.facilities || []).some((facility) => facility.toLowerCase() === selectedFacility)
      );
    }

    if (minPrice > 0) {
      results = results.filter((property) => property.priceValue !== null && property.priceValue >= minPrice);
    }

    if (maxPrice > 0) {
      results = results.filter((property) => property.priceValue !== null && property.priceValue <= maxPrice);
    }

    if (filters.sortBy === 'price-low') {
      results.sort((a, b) => (a.priceValue ?? Number.MAX_SAFE_INTEGER) - (b.priceValue ?? Number.MAX_SAFE_INTEGER));
    } else if (filters.sortBy === 'price-high') {
      results.sort((a, b) => (b.priceValue ?? 0) - (a.priceValue ?? 0));
    }

    return results;
  }, [allProperties, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      minPrice: '',
      maxPrice: '',
      facility: '',
      sortBy: 'newest'
    });
  };

  return (
    <div className="listings-page">
      <BannerSection title="Find Your Perfect Hotel" subtitle={`${filteredProperties.length} hotels available`} />

      <div className="container">
        <div className="listings-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">Clear All</button>
            </div>

            <div className="filter-group">
              <label>Destination Name</label>
              <select name="destination" value={filters.destination} onChange={handleFilterChange}>
                <option value="">All Destinations</option>
                {destinationOptions.map((destination) => (
                  <option key={destination.value} value={destination.value}>{destination.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Facility</label>
              <select name="facility" value={filters.facility} onChange={handleFilterChange}>
                <option value="">All Facilities</option>
                {facilityOptions.map((facility) => (
                  <option key={facility} value={facility}>{facility}</option>
                ))}
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
            {loading ? (
              <div className="no-results">
                <h3>Loading hotels...</h3>
              </div>
            ) : loadError ? (
              <div className="no-results">
                <h3>Unable to load hotels</h3>
                <p>{loadError}</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="properties-grid">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No hotels found</h3>
                <p>Try adjusting destination, facility, or price range filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
