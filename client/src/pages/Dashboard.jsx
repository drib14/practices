import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, logoutAllUser } from '../store/slices/authSlice.js';
import { fetchMyBookings, createBooking, cancelBooking } from '../store/slices/bookingSlice.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: bookings, loading, creating } = useSelector((state) => state.bookings);

  const [showProfile, setShowProfile] = useState(false);

  // Booking Form State
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledTime, setScheduledTime] = useState('');

  // Polling for booking updates (to simulate accepted worker)
  useEffect(() => {
    dispatch(fetchMyBookings());
    const interval = setInterval(() => {
      dispatch(fetchMyBookings());
    }, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [dispatch]);

  if (!user) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!description || !location) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please provide a job description and location.'
      });
      return;
    }

    let finalTime = new Date();
    if (scheduleType === 'later') {
      if (!scheduledTime) {
        Swal.fire({ icon: 'error', title: 'Missing Time', text: 'Please select a scheduled time.' });
        return;
      }
      finalTime = new Date(scheduledTime);
    }

    const result = await dispatch(createBooking({
      category,
      description,
      location,
      scheduledTime: finalTime.toISOString()
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      Swal.fire({
        icon: 'success',
        title: 'Worker Requested!',
        text: 'We are now searching for an available worker.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      setDescription('');
      setLocation('');
      setScheduledTime('');
    }
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Cancel Request?',
      text: "Are you sure you want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(cancelBooking(id));
      }
    });
  };

  const categories = [
    'Plumbing', 'Electrical', 'House Cleaning', 'Appliance Repair',
    'Carpentry', 'Painting', 'Gardening', 'Air Conditioning',
    'Pest Control', 'Laundry', 'Moving', 'Tutoring'
  ];

  return (
    <main className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)' }}></i>
          <span>FixConnect On-Demand</span>
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
          </div>

          <footer className="btn-group">
            <Button variant="secondary" onClick={() => dispatch(logoutAllUser())}>
              <i className="fa-solid fa-desktop"></i> Sign Out All Devices
            </Button>
          </footer>
        </section>
      )}

      {/* On-Demand Layout */}
      <div className="discovery-layout">
        
        {/* Request Form Sidebar */}
        <aside className="filters-sidebar" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="filter-section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Request a Worker</h2>
          
          <form onSubmit={handleBookingSubmit}>
            <div className="filter-group">
              <label>What do you need help with?</label>
              <select
                className="filter-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Job Description</label>
              <textarea
                className="filter-input"
                placeholder="e.g. My kitchen sink is leaking heavily."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="filter-group">
              <label>Location / Address</label>
              <Input
                type="text"
                placeholder="e.g. 123 Main St, Apt 4B"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>When do you need them?</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="schedule" value="now" checked={scheduleType === 'now'} onChange={() => setScheduleType('now')} />
                  Right Now
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="schedule" value="later" checked={scheduleType === 'later'} onChange={() => setScheduleType('later')} />
                  Schedule Later
                </label>
              </div>

              {scheduleType === 'later' && (
                <Input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              )}
            </div>

            <Button type="submit" disabled={creating} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              {creating ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Request Worker'}
            </Button>
          </form>
        </aside>

        {/* Active & Past Bookings */}
        <section className="catalog-section">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--gray-900)' }}>My Requests</h2>

          {loading && bookings.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <p><i className="fa-solid fa-circle-notch fa-spin"></i> Loading requests...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-clipboard-list" style={{ fontSize: '3rem', color: 'var(--gray-400)', marginBottom: '1rem' }}></i>
              <h3>No Requests Yet</h3>
              <p>When you request a worker, you'll be able to track their status here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map((booking) => (
                <div key={booking._id} style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${
                    booking.status === 'Searching' ? 'var(--warning)' :
                    booking.status === 'Accepted' ? 'var(--success)' :
                    booking.status === 'Cancelled' ? 'var(--danger)' : 'var(--primary)'
                  }`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="service-card-tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{booking.category}</span>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--gray-900)' }}>{booking.description}</h3>
                    </div>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: booking.status === 'Searching' ? '#fffbeb' : booking.status === 'Accepted' ? '#ecfdf5' : booking.status === 'Cancelled' ? '#fef2f2' : '#eef2ff',
                      color: booking.status === 'Searching' ? '#d97706' : booking.status === 'Accepted' ? '#059669' : booking.status === 'Cancelled' ? '#dc2626' : '#4f46e5'
                    }}>
                      {booking.status === 'Searching' ? <i className="fa-solid fa-radar fa-spin"></i> : null} {booking.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                    <div><i className="fa-solid fa-location-dot"></i> {booking.location}</div>
                    <div><i className="fa-solid fa-clock"></i> {new Date(booking.scheduledTime).toLocaleString()}</div>
                  </div>

                  {booking.status === 'Accepted' && booking.assignedWorker && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '1rem' }}>
                      {booking.assignedWorker.profilePhoto ? (
                        <img src={booking.assignedWorker.profilePhoto} alt="Worker" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gray-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fa-solid fa-user" style={{ color: '#fff' }}></i>
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{booking.assignedWorker.displayName}</div>
                        <div style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-star" style={{ color: '#fbbf24' }}></i> {booking.assignedWorker.averageRating} Rating</div>
                      </div>
                    </div>
                  )}

                  {(booking.status === 'Searching' || booking.status === 'Accepted') && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="secondary" onClick={() => handleCancel(booking._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--danger)' }}>
                        Cancel Request
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
