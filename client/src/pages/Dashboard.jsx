import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, logoutAllUser } from '../store/slices/authSlice.js';
import { fetchServices, fetchCategories, fetchServiceBySlug, clearSelectedService } from '../store/slices/servicesSlice.js';
import Button from '../components/Button.jsx';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: services, categories, selectedItem: selectedService, loading, categoriesLoading } = useSelector((state) => state.services);

  // Profile overlay / collapse toggle
  const [showProfile, setShowProfile] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Fetch initial categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch services when parameters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchServices({
        search,
        category,
        serviceArea,
        minPrice,
        maxPrice,
        sort,
        page
      }));
    }, 300); // 300ms debounce on keystrokes

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, search, category, serviceArea, minPrice, maxPrice, sort, page]);

  if (!user) return null;

  const handleCardClick = (slug) => {
    dispatch(fetchServiceBySlug(slug));
  };

  const handleCloseModal = () => {
    dispatch(clearSelectedService());
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setServiceArea('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  return (
    <main className="dashboard-container">
      
      {/* Top Header */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/favicon.png" 
            alt="FixConnect Logo" 
            className="brand-logo-img" 
            style={{ width: '40px', height: '40px', margin: 0 }} 
            onError={(e) => e.target.style.display = 'none'} 
          />
          <div>
            <h1 className="dashboard-title-logo" style={{ margin: 0 }}>FixConnect</h1>
            <p className="brand-subtitle" style={{ margin: 0 }}>Service Discovery Portal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }} className="user-nav-meta">
            <p style={{ fontWeight: 600, margin: 0 }}>{user.firstName} {user.lastName}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Role: {user.role?.toUpperCase()}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setShowProfile(!showProfile)}>
            <i className="fa-solid fa-user-cog"></i> Profile
          </Button>
          <Button onClick={() => dispatch(logoutUser())}>
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </Button>
        </div>
      </header>

      {/* Collapsible Profile widget */}
      {showProfile && (
        <section className="profile-card animate-fadeIn">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="dashboard-welcome" style={{ margin: 0 }}>Your Account Profile</h2>
            <Button variant="secondary" onClick={() => setShowProfile(false)} style={{ padding: '6px 12px' }}>Close Info</Button>
          </header>
          
          <div className="profile-grid">
            <div className="profile-item">
              <div className="profile-item-label">First Name</div>
              <div className="profile-item-value">{user.firstName}</div>
            </div>
            <div className="profile-item">
              <div className="profile-item-label">Last Name</div>
              <div className="profile-item-value">{user.lastName}</div>
            </div>
            <div className="profile-item">
              <div className="profile-item-label">Username</div>
              <div className="profile-item-value">{user.username}</div>
            </div>
            <div className="profile-item">
              <div className="profile-item-label">Email Address</div>
              <div className="profile-item-value">{user.email}</div>
            </div>
            <div className="profile-item">
              <div className="profile-item-label">Account Role</div>
              <div className="profile-item-value">
                {user.role === 'provider' ? 'Service Provider' : 'Customer'}
              </div>
            </div>
          </div>

          <footer className="btn-group">
            <Button variant="secondary" onClick={() => dispatch(logoutAllUser())}>
              <i className="fa-solid fa-desktop"></i> Sign Out (All Devices)
            </Button>
          </footer>
        </section>
      )}

      {/* Main Service Discovery Grid & Filter Sidebar */}
      <div className="discovery-layout">
        
        {/* Sidebar Controls */}
        <aside className="filters-sidebar">
          <h2 className="filter-section-title">Filters</h2>
          
          <div className="filter-group">
            <label htmlFor="filter-category">Category</label>
            <select 
              id="filter-category" 
              className="filter-select"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-area">Service Area</label>
            <input 
              type="text" 
              id="filter-area"
              className="filter-input"
              placeholder="e.g. North Side"
              value={serviceArea}
              onChange={(e) => { setServiceArea(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-group">
            <label>Price Range ($)</label>
            <div className="price-range-inputs">
              <input 
                type="number" 
                placeholder="Min"
                className="filter-input"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              />
              <span>to</span>
              <input 
                type="number" 
                placeholder="Max"
                className="filter-input"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <Button variant="secondary" onClick={handleResetFilters} style={{ marginTop: '10px' }}>
            <i className="fa-solid fa-rotate-left"></i> Reset Filters
          </Button>
        </aside>

        {/* Catalog Main View */}
        <section className="catalog-section">
          
          {/* Search bar & Sorting bar */}
          <div className="catalog-actions-bar">
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Search services, descriptions, or tags..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div className="sort-wrapper">
              <span>Sort By:</span>
              <select 
                className="filter-select" 
                style={{ width: 'auto' }}
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Service Cards Listing */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <p><i className="fa-solid fa-circle-notch fa-spin"></i> Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-folder-open"></i>
              <h3>No Services Found</h3>
              <p>We couldn't find any services matching your criteria. Try adjusting your search queries or category filters.</p>
              <Button onClick={handleResetFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((svc) => (
                <article 
                  key={svc._id} 
                  className="service-card animate-fadeIn"
                  onClick={() => handleCardClick(svc.slug)}
                >
                  <div className="service-card-body">
                    <span className="service-card-tag">{svc.category}</span>
                    <h3 className="service-card-title">{svc.title}</h3>
                    <p className="service-card-desc">{svc.shortDescription}</p>
                    <div className="service-card-provider">
                      <i className="fa-solid fa-circle-user"></i> {svc.providerName}
                    </div>
                  </div>
                  <div className="service-card-footer">
                    <span className="service-card-price">
                      ${svc.startingPrice}<span>/job</span>
                    </span>
                    <button className="service-card-btn">
                      Details <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Service Details Popup Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="modal-body">
              <div className="modal-header-meta">
                <span className="service-card-tag">{selectedService.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-location-dot"></i> {selectedService.serviceArea}
                </span>
              </div>
              
              <h2 className="modal-title">{selectedService.title}</h2>
              
              <div className="modal-info-bar">
                <div className="modal-info-item">
                  <span className="modal-info-label">Estimated Price</span>
                  <span className="modal-info-value" style={{ color: 'var(--success)' }}>
                    Starting at ${selectedService.startingPrice}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Provider</span>
                  <span className="modal-info-value">{selectedService.providerName}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Estimated Duration</span>
                  <span className="modal-info-value">{selectedService.estimatedDuration}</span>
                </div>
              </div>

              <div>
                <h3 className="modal-description-title">Service Description</h3>
                <p className="modal-description-text">{selectedService.fullDescription}</p>
              </div>

              {selectedService.tags && selectedService.tags.length > 0 && (
                <div>
                  <h3 className="modal-description-title" style={{ fontSize: '0.85rem' }}>Tags</h3>
                  <div className="modal-tags">
                    {selectedService.tags.map((tag) => (
                      <span key={tag} className="modal-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related/Recommended Services */}
              {selectedService.relatedServices && selectedService.relatedServices.length > 0 && (
                <div className="related-section">
                  <h3 className="related-title">Recommended Services</h3>
                  <div className="related-grid">
                    {selectedService.relatedServices.map((rel) => (
                      <div 
                        key={rel._id} 
                        className="related-card"
                        onClick={() => handleCardClick(rel.slug)}
                      >
                        <h4 className="related-card-title">{rel.title}</h4>
                        <div className="related-card-meta">
                          <span style={{ color: 'var(--primary)' }}>${rel.startingPrice}</span>
                          <span>{rel.providerName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Limitation Notice */}
              <div style={{ 
                marginTop: '16px', 
                padding: '16px', 
                backgroundColor: 'rgba(79, 70, 229, 0.05)', 
                border: '1px solid rgba(79, 70, 229, 0.15)', 
                borderRadius: '8px',
                textAlign: 'center',
                color: 'var(--primary-indigo-dark)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                <i className="fa-solid fa-calendar-xmark"></i> Booking &amp; Scheduling functionality is coming soon.
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
