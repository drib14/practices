import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Register({ setView }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Password Checklist
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handlePasswordChange = (val) => {
    setPassword(val);
    setPasswordChecks({
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      lowercase: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>_+-]/.test(val)
    });
  };

  const handleStep1Next = () => {
    if (!username.trim() || !email.trim()) {
      Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please enter a username and email address.', confirmButtonColor: '#0f172a' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.', confirmButtonColor: '#0f172a' });
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    const isStrong = Object.values(passwordChecks).every(v => v);
    if (!isStrong) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Your password must satisfy all security rules.', confirmButtonColor: '#0f172a' });
      return;
    }
    setCurrentStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please enter both your first and last name.', confirmButtonColor: '#0f172a' });
      return;
    }

    try {
      const response = await axios.post('/auth/register', {
        username,
        email,
        firstName,
        lastName,
        password
      });

      Swal.fire({
        icon: 'success',
        title: 'Check Your Email',
        text: response.data.message,
        confirmButtonColor: '#0f172a'
      }).then(() => {
        setView('login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.error || 'An unexpected error occurred.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  // Stepper helper text
  const getStepSubtitle = () => {
    if (currentStep === 1) return 'Step 1: Enter your account details';
    if (currentStep === 2) return 'Step 2: Choose a secure password';
    return 'Step 3: Define your profile';
  };

  return (
    <main class="glass-card">
      <header class="brand-header">
        <img src="/favicon.png" alt="FixConnect Logo" class="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
        <h1 class="brand-logo">Create Account</h1>
        <p class="brand-subtitle">{getStepSubtitle()}</p>
      </header>

      {/* Stepper Progress bar */}
      <div class="stepper-container">
        <div class="stepper-line"></div>
        <div 
          class="stepper-progress" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        <div class={`step-node ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
          {currentStep > 1 ? <i class="fa-solid fa-check"></i> : '1'}
        </div>
        <div class={`step-node ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
          {currentStep > 2 ? <i class="fa-solid fa-check"></i> : '2'}
        </div>
        <div class={`step-node ${currentStep === 3 ? 'active' : ''}`}>
          3
        </div>
      </div>

      <form onSubmit={handleSubmit} novalidate>
        
        {/* STEP 1: Account credentials */}
        {currentStep === 1 && (
          <div class="step-pane active">
            <div class="form-group">
              <label class="form-label">Username</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-user input-icon"></i>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Choose a username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  class="form-control" 
                  placeholder="yourname@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div class="stepper-nav">
              <button type="button" onClick={handleStep1Next} class="btn-premium">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 2: Password strength checklist */}
        {currentStep === 2 && (
          <div class="step-pane active">
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-lock input-icon"></i>
                <input 
                  type="password" 
                  class="form-control" 
                  placeholder="Minimum 8 characters" 
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required 
                />
              </div>
              
              <div class="password-checklists">
                <span class={`check-item ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.length ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 8+ Chars
                </span>
                <span class={`check-item ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.uppercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Uppercase
                </span>
                <span class={`check-item ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.lowercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Lowercase
                </span>
                <span class={`check-item ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.number ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Number
                </span>
                <span class={`check-item ${passwordChecks.special ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.special ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Special Char
                </span>
              </div>
            </div>

            <div class="stepper-nav">
              <button type="button" onClick={() => setCurrentStep(1)} class="btn-premium btn-secondary">Back</button>
              <button type="button" onClick={handleStep2Next} class="btn-premium">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: Profile setting */}
        {currentStep === 3 && (
          <div class="step-pane active">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-signature input-icon"></i>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter first name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Last Name</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-signature input-icon"></i>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter last name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div class="stepper-nav">
              <button type="button" onClick={() => setCurrentStep(2)} class="btn-premium btn-secondary">Back</button>
              <button type="submit" class="btn-premium">Complete Registration</button>
            </div>
          </div>
        )}

      </form>

      <footer class="auth-footer">
        <p>Already have an account? <span onClick={() => setView('login')} class="auth-link">Sign In here</span></p>
      </footer>
    </main>
  );
}
