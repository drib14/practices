import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Stepper from '../components/Stepper.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { registerUser } from '../store/slices/authSlice.js';
import { checkPasswordStrength } from '../utils/password.js';

export default function Register({ setView }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordChecks(checkPasswordStrength(value));
  };

  const handleStep1Next = () => {
    if (!username.trim() || !email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please enter a username and email address.',
        confirmButtonColor: '#0f172a',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#0f172a',
      });
      return;
    }

    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    const isStrong = Object.values(passwordChecks).every(Boolean);

    if (!isStrong) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Your password must satisfy all security rules.',
        confirmButtonColor: '#0f172a',
      });
      return;
    }

    setCurrentStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please enter both your first and last name.',
        confirmButtonColor: '#0f172a',
      });
      return;
    }

    dispatch(
      registerUser({
        username,
        email,
        firstName,
        lastName,
        password,
      })
    );
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Step 1: Enter your account details';
      case 2:
        return 'Step 2: Choose a secure password';
      default:
        return 'Step 3: Define your profile';
    }
  };

  return (
    <main className="glass-card">
      <header className="brand-header">
        <img
          src="/favicon.png"
          alt="FixConnect Logo"
          className="brand-logo-img"
          onError={(e) => (e.target.style.display = 'none')}
        />
        <h1 className="brand-logo">Create Account</h1>
        <p className="brand-subtitle">{getStepSubtitle()}</p>
      </header>

      <Stepper currentStep={currentStep} totalSteps={totalSteps} />

      <form onSubmit={handleSubmit} noValidate>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="step-pane active">
            <Input
              label="Username"
              icon="fa-solid fa-user"
              placeholder="Choose a username"
              value={username}
              onChange={setUsername}
              required
            />

            <Input
              label="Email Address"
              icon="fa-solid fa-envelope"
              type="email"
              placeholder="yourname@example.com"
              value={email}
              onChange={setEmail}
              required
            />

            <div className="stepper-nav">
              <Button onClick={handleStep1Next}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="step-pane active">

            <Input
              label="Password"
              icon="fa-solid fa-lock"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={handlePasswordChange}
              required
            />

            <div className="password-checklists">
              <span className={`check-item ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.length ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                {' '}8+ Characters
              </span>

              <span className={`check-item ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.uppercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                {' '}Uppercase
              </span>

              <span className={`check-item ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.lowercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                {' '}Lowercase
              </span>

              <span className={`check-item ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.number ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                {' '}Number
              </span>

              <span className={`check-item ${passwordChecks.special ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.special ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                {' '}Special Character
              </span>
            </div>

            <div className="stepper-nav">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>

              <Button onClick={handleStep2Next}>
                Continue
              </Button>
            </div>

          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="step-pane active">

            <Input
              label="First Name"
              icon="fa-solid fa-signature"
              placeholder="Enter first name"
              value={firstName}
              onChange={setFirstName}
              required
            />

            <Input
              label="Last Name"
              icon="fa-solid fa-signature"
              placeholder="Enter last name"
              value={lastName}
              onChange={setLastName}
              required
            />

            <div className="stepper-nav">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>

              <Button
                type="submit"
                loading={loading}
              >
                Complete Registration
              </Button>
            </div>

          </div>
        )}

      </form>

      <footer className="auth-footer">
        <p>
          Already have an account?{' '}
          <span
            className="auth-link"
            onClick={() => setView('login')}
          >
            Sign In here
          </span>
        </p>
      </footer>
    </main>
  );
}