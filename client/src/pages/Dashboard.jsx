import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, logoutAllUser } from '../store/slices/authSlice.js';
import { fetchWorkers, fetchCategories, fetchWorkerById, clearSelectedWorker } from '../store/slices/workerSlice.js';
import Button from '../components/Button.jsx';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: workers, categories, selectedItem: selectedWorker, loading, categoriesLoading } = useSelector((state) => state.workers);

  const [showProfile, setShowProfile] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [sort, setSort] = useState('recommended');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchWorkers({
        search,
        category,
        city,
        minPrice,
        maxPrice,
        minRating,
        minExperience,
        sort,
        page
      }));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, search, category, city, minPrice, maxPrice, minRating, minExperience, sort, page]);

  if (!user) return null;

  const handleCardClick = (id) => {
    dispatch(fetchWorkerById(id));
  };

  const handleCloseModal = () => {
    dispatch(clearSelectedWorker());
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMinExperience('');
    setSort('recommended');
    setPage(1);
  };

  return (
    <main className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <i className="fa-solid fa-wrench" style={{ color: 'var(--primary)' }}></i>
          <span>FixConnect</span>
        </div>
        <div className="nav-user" onClick={() => setShowProfile(!showProfile)}>
          <div className="avatar-circle">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <span className="user-greeting">Hi, {user.firstName}</span>
          <i className={`fa-solid fa-chevron-${showProfile ? 'up' : 'down'} toggle-icon`}></i>
        </div>
      </nav>

      {/* Profile Dropdown */}
      {showProfile && (
        <section className="profile-panel animate-fadeIn">
          <header className="profile-header">
            <h3>Account Settings</h3>
            <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
              {user.isVerified ? (
                <><i className="fa-solid fa-circle-check"></i> Verified</>
              ) : (
                <><i className="fa-solid fa-circle-xmark"></i> Unverified</>
              )}
            </span>
          </header>

          <div className="profile-content">
            <div className="profile-item">
              <label>Full Name</label>
              <div className="profile-item-value">{user.firstName} {user.lastName}</div>
            </div>
            <div className="profile-item">
              <label>Email Address</label>
              <div className="profile-item-value">{user.email}</div>
            </div>
            <div className="profile-item">
              <label>Account Type</label>
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

      {/* Discovery Area */}
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
            <label htmlFor="filter-area">City</label>
            <input 
              type="text" 
              id="filter-area"
              className="filter-input"
              placeholder="e.g. New York"
              value={city}
              onChange={(e) => { setCity(e.target.value); setPage(1); }}
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

          <div className="filter-group">
            <label>Minimum Rating</label>
            <input
              type="number"
              placeholder="e.g. 4.5"
              step="0.1"
              min="0" max="5"
              className="filter-input"
              value={minRating}
              onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-group">
            <label>Years of Experience</label>
            <input
              type="number"
              placeholder="Min Years"
              className="filter-input"
              value={minExperience}
              onChange={(e) => { setMinExperience(e.target.value); setPage(1); }}
            />
          </div>

          <Button variant="secondary" onClick={handleResetFilters} style={{ marginTop: '10px' }}>
            <i className="fa-solid fa-rotate-left"></i> Reset Filters
          </Button>
        </aside>

        {/* Worker Main View */}
        <section className="catalog-section">
          
          <div className="catalog-actions-bar">
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Search workers by name, skills, category..."
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
                <option value="recommended">Recommended</option>
                <option value="nearest">Nearest</option>
                <option value="highestRated">Highest Rated</option>
                <option value="mostExperienced">Most Experienced</option>
                <option value="lowestPrice">Lowest Price</option>
                <option value="highestPrice">Highest Price</option>
                <option value="recentlyJoined">Recently Joined</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <p><i className="fa-solid fa-circle-notch fa-spin"></i> Loading workers...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-user-xmark" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
              <h3>No Workers Found</h3>
              <p>We couldn't find any workers matching your criteria. Try adjusting your search queries or filters.</p>
              <Button onClick={handleResetFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="workers-grid">
              {workers.map((worker) => (
                <article 
                  key={worker._id}
                  className="worker-card animate-fadeIn"
                  onClick={() => handleCardClick(worker._id)}
                >
                  <div className="worker-card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {worker.profilePhoto ? (
                       <img src={worker.profilePhoto} alt={worker.displayName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <i className="fa-solid fa-user" style={{ color: 'var(--gray-500)', fontSize: '1.5rem' }}></i>
                      </div>
                    )}
                    <div>
                      <h3 className="worker-card-title">
                        {worker.displayName}
                        {worker.verificationStatus === 'Verified' && <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary)', marginLeft: '6px', fontSize: '1rem' }} title="Verified Worker"></i>}
                      </h3>
                      <p className="worker-card-desc" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        {worker.categories.join(', ')}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span><i className="fa-solid fa-star" style={{ color: '#fbbf24' }}></i> {worker.averageRating} ({worker.completedJobs} jobs)</span>
                        <span><i className="fa-solid fa-location-dot"></i> {worker.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="worker-card-footer">
                    <span className="worker-card-price">
                      ${worker.startingPrice}<span>/hr</span>
                    </span>
                    <button className="worker-card-btn">
                      View Profile <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Worker Profile Modal */}
      {selectedWorker && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                {selectedWorker.profilePhoto ? (
                  <img src={selectedWorker.profilePhoto} alt={selectedWorker.displayName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-user" style={{ color: 'var(--gray-500)', fontSize: '2.5rem' }}></i>
                  </div>
                )}
                <div>
                  <h2 className="modal-title" style={{ marginBottom: '0.2rem' }}>
                    {selectedWorker.fullName}
                    {selectedWorker.verificationStatus === 'Verified' && <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary)', marginLeft: '8px', fontSize: '1.2rem' }} title="Verified Worker"></i>}
                  </h2>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <i className="fa-solid fa-location-dot"></i> {selectedWorker.city}, {selectedWorker.province} (Covers {selectedWorker.serviceRadius} miles)
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <span><i className="fa-solid fa-star" style={{ color: '#fbbf24' }}></i> {selectedWorker.averageRating} Rating</span>
                    <span><i className="fa-solid fa-briefcase"></i> {selectedWorker.completedJobs} Jobs Completed</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-info-bar">
                <div className="modal-info-item">
                  <span className="modal-info-label">Starting Price</span>
                  <span className="modal-info-value" style={{ color: 'var(--success)' }}>
                    ${selectedWorker.startingPrice}/hr
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Experience</span>
                  <span className="modal-info-value">{selectedWorker.yearsExperience} Years</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Response Time</span>
                  <span className="modal-info-value">{selectedWorker.responseTime} ({selectedWorker.responseRate}%)</span>
                </div>
              </div>

              <div>
                <h3 className="modal-description-title">About Me</h3>
                <p className="modal-description-text">{selectedWorker.bio}</p>
              </div>

              {selectedWorker.skills && selectedWorker.skills.length > 0 && (
                <div>
                  <h3 className="modal-description-title" style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Skills</h3>
                  <div className="modal-tags">
                    {selectedWorker.skills.map((skill) => (
                      <span key={skill} className="modal-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedWorker.certifications && selectedWorker.certifications.length > 0 && (
                <div>
                  <h3 className="modal-description-title" style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Certifications</h3>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {selectedWorker.certifications.map((cert) => (
                      <li key={cert} style={{ marginBottom: '0.25rem' }}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedWorker.languages && selectedWorker.languages.length > 0 && (
                <div>
                  <h3 className="modal-description-title" style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Languages</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {selectedWorker.languages.join(', ')}
                  </p>
                </div>
              )}

              {selectedWorker.similarWorkers && selectedWorker.similarWorkers.length > 0 && (
                <div className="related-section" style={{ marginTop: '2rem' }}>
                  <h3 className="related-title">Similar Workers</h3>
                  <div className="related-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {selectedWorker.similarWorkers.map((rel) => (
                      <div 
                        key={rel._id} 
                        className="related-card"
                        onClick={() => handleCardClick(rel._id)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}
                      >
                        {rel.profilePhoto ? (
                          <img src={rel.profilePhoto} alt={rel.displayName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                            <i className="fa-solid fa-user" style={{ color: 'var(--gray-500)', fontSize: '1.2rem' }}></i>
                          </div>
                        )}
                        <h4 className="related-card-title" style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{rel.displayName}</h4>
                        <div className="related-card-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rel.city}</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${rel.startingPrice}/hr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Limitation Notice */}
              <div style={{ 
                marginTop: '1.5rem',
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
