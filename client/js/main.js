// Configure Axios defaults for cookies and base URL
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Axios Interceptor for automated token refreshing
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the response failed because the access token expired
    if (
      error.response?.status === 401 && 
      error.response?.data?.code === 'TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt token rotation
        await axios.post('/auth/refresh');
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Session expired or compromised (reused token). Force redirect to login.
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Your security session has expired. Please log in again.',
          confirmButtonColor: '#6366f1'
        }).then(() => {
          window.location.href = 'login.html';
        });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Client-side Password Strength Evaluator
const checkPasswordStrength = (password, email = '') => {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_+-]/.test(password)
  };
  return checks;
};

const updateChecklistUI = (checks, prefix = '') => {
  const elements = {
    length: document.getElementById(`${prefix}len-check`),
    uppercase: document.getElementById(`${prefix}upper-check`),
    lowercase: document.getElementById(`${prefix}lower-check`),
    number: document.getElementById(`${prefix}num-check`),
    special: document.getElementById(`${prefix}special-check`)
  };

  Object.keys(elements).forEach(key => {
    const el = elements[key];
    if (!el) return;
    if (checks[key]) {
      el.classList.remove('invalid');
      el.classList.add('valid');
      el.querySelector('i').className = 'fa-solid fa-circle-check';
    } else {
      el.classList.remove('valid');
      el.classList.add('invalid');
      el.querySelector('i').className = 'fa-solid fa-circle-xmark';
    }
  });
};

// --- DOM Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);

  // Determine Page Mode
  if (page === 'register.html') {
    initRegisterPage();
  } else if (page === 'login.html') {
    initLoginPage();
  } else if (page === 'dashboard.html') {
    initDashboardPage();
  }
});

// --- Register Page Setup ---
function initRegisterPage() {
  const regForm = document.getElementById('register-form');
  const passwordInput = document.getElementById('reg-password');
  const emailInput = document.getElementById('reg-email');

  // Real-time password check
  passwordInput.addEventListener('input', () => {
    const checks = checkPasswordStrength(passwordInput.value, emailInput.value);
    updateChecklistUI(checks);
  });

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('reg-fullname').value;
    const username = document.getElementById('reg-username').value;
    const email = emailInput.value;
    const role = document.getElementById('reg-role').value;
    const password = passwordInput.value;

    // Local validation
    const checks = checkPasswordStrength(password, email);
    const isStrong = Object.values(checks).every(v => v);
    if (!isStrong) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Please satisfy all password safety criteria indicated.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    try {
      const response = await axios.post('/auth/register', {
        fullName,
        username,
        email,
        role,
        password
      });

      Swal.fire({
        icon: 'success',
        title: 'Check Your Email',
        text: response.data.message,
        confirmButtonColor: '#6366f1'
      }).then(() => {
        window.location.href = 'login.html';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'An unexpected error occurred.',
        confirmButtonColor: '#6366f1'
      });
    }
  });
}

// --- Login Page Setup (Multi-state) ---
function initLoginPage() {
  const loginSection = document.getElementById('login-section');
  const forgotSection = document.getElementById('forgot-section');
  const resetSection = document.getElementById('reset-section');

  const loginForm = document.getElementById('login-form');
  const forgotForm = document.getElementById('forgot-form');
  const resetForm = document.getElementById('reset-form');

  const forgotLink = document.getElementById('forgot-password-link');
  const backToLogin = document.getElementById('back-to-login-btn');

  const resetPasswordInput = document.getElementById('reset-password');
  const resetTokenInput = document.getElementById('reset-token');

  // Parse URL queries for verification or reset callbacks
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get('token');
  const resetToken = urlParams.get('resetToken');

  // 1. Email Verification Callback Trigger
  if (verifyToken) {
    Swal.fire({
      title: 'Verifying Email...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    axios.get(`/auth/verify?token=${verifyToken}`)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Verified!',
          text: res.data.message,
          confirmButtonColor: '#6366f1'
        }).then(() => {
          // Clear query string params
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: err.response?.data?.error || 'Invalid or expired token.',
          confirmButtonColor: '#6366f1'
        });
      });
  }

  // 2. Password Reset Callback State
  if (resetToken) {
    loginSection.style.display = 'none';
    forgotSection.style.display = 'none';
    resetSection.style.display = 'block';
    resetTokenInput.value = resetToken;

    resetPasswordInput.addEventListener('input', () => {
      const checks = checkPasswordStrength(resetPasswordInput.value);
      updateChecklistUI(checks, 'reset-');
    });
  }

  // View switches
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    forgotSection.style.display = 'block';
  });

  backToLogin.addEventListener('click', () => {
    forgotSection.style.display = 'none';
    loginSection.style.display = 'block';
  });

  // Handle Login Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernameOrEmail = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      await axios.post('/auth/login', { usernameOrEmail, password });
      window.location.href = 'dashboard.html';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: error.response?.data?.error || 'Invalid username/email or password.',
        confirmButtonColor: '#6366f1'
      });
    }
  });

  // Handle Forgot Password Submission
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      Swal.fire({
        icon: 'info',
        title: 'Check Your Inbox',
        text: res.data.message,
        confirmButtonColor: '#6366f1'
      }).then(() => {
        forgotSection.style.display = 'none';
        loginSection.style.display = 'block';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.response?.data?.error || 'An error occurred.',
        confirmButtonColor: '#6366f1'
      });
    }
  });

  // Handle Reset Password Submission
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = resetTokenInput.value;
    const newPassword = resetPasswordInput.value;

    const checks = checkPasswordStrength(newPassword);
    const isStrong = Object.values(checks).every(v => v);
    if (!isStrong) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Please satisfy all password safety criteria.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    try {
      const res = await axios.post('/auth/reset-password', { token, newPassword });
      Swal.fire({
        icon: 'success',
        title: 'Reset Complete',
        text: res.data.message,
        confirmButtonColor: '#6366f1'
      }).then(() => {
        window.location.href = 'login.html';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: error.response?.data?.error || 'Failed to reset password.',
        confirmButtonColor: '#6366f1'
      });
    }
  });
}

// --- Dashboard Page Setup ---
async function initDashboardPage() {
  const profileFullname = document.getElementById('profile-fullname');
  const profileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');
  const profileRole = document.getElementById('profile-role');
  
  const headerName = document.getElementById('user-header-name');
  const headerRole = document.getElementById('user-header-role');

  const logoutBtn = document.getElementById('logout-btn');
  const logoutAllBtn = document.getElementById('logout-all-btn');

  // Retrieve user details on load
  try {
    const res = await axios.get('/auth/profile');
    const user = res.data.data;

    // Populate profile details
    profileFullname.textContent = user.fullName;
    profileUsername.textContent = user.username;
    profileEmail.textContent = user.email;
    profileRole.textContent = user.role;
    
    // Style role box if provider
    if (user.role === 'provider') {
      document.getElementById('p-role-box').classList.add('role-provider');
    }

    // Populate header details
    headerName.textContent = user.fullName;
    headerRole.textContent = `Role: ${user.role.toUpperCase()}`;

  } catch (error) {
    // Interceptor redirects on refresh failure, but handle fallback redirect just in case
    console.error('Failed to load profile details', error);
  }

  // Handle Logout Current Session
  logoutBtn.addEventListener('click', async () => {
    try {
      await axios.post('/auth/logout');
      window.location.href = 'login.html';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'Failed to sign out correctly.',
        confirmButtonColor: '#6366f1'
      });
    }
  });

  // Handle Logout All Session Devices
  logoutAllBtn.addEventListener('click', async () => {
    try {
      await axios.post('/auth/logout-all');
      window.location.href = 'login.html';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'Failed to sign out from all devices.',
        confirmButtonColor: '#6366f1'
      });
    }
  });
}
