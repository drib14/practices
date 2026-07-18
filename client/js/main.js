// Configure Axios defaults for credentials and base URL
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Axios Interceptor for automated token refreshing
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 && 
      error.response?.data?.code === 'TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post('/auth/refresh');
        return axios(originalRequest);
      } catch (refreshError) {
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Your security session has expired. Please log in again.',
          confirmButtonColor: '#0f172a'
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
const checkPasswordStrength = (password) => {
  return {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_+-]/.test(password)
  };
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

  if (page === 'register.html') {
    initRegisterPage();
  } else if (page === 'login.html') {
    initLoginPage();
  } else if (page === 'dashboard.html') {
    initDashboardPage();
  }
});

// --- Register Page Setup (Walkthrough Wizard) ---
function initRegisterPage() {
  const regForm = document.getElementById('register-form');
  const passwordInput = document.getElementById('reg-password');
  const emailInput = document.getElementById('reg-email');
  const usernameInput = document.getElementById('reg-username');
  const fullNameInput = document.getElementById('reg-fullname');
  const roleInput = document.getElementById('reg-role');

  let currentStep = 1;
  const totalSteps = 3;

  // Step Indicators and Progress
  const progressLine = document.getElementById('stepper-progress');
  const nodes = [
    document.getElementById('step-node-1'),
    document.getElementById('step-node-2'),
    document.getElementById('step-node-3')
  ];
  const panes = [
    document.getElementById('step-pane-1'),
    document.getElementById('step-pane-2'),
    document.getElementById('step-pane-3')
  ];
  const subtitle = document.getElementById('step-subtitle');

  const updateWizardUI = (step) => {
    // Update progress bar width: 0% at Step 1, 50% at Step 2, 100% at Step 3
    const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = `${progressPercent}%`;

    // Update Nodes classes
    nodes.forEach((node, index) => {
      const nodeStep = index + 1;
      if (nodeStep < step) {
        node.className = 'step-node completed';
        node.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (nodeStep === step) {
        node.className = 'step-node active';
        node.textContent = nodeStep;
      } else {
        node.className = 'step-node';
        node.textContent = nodeStep;
      }
    });

    // Update Step Subtitle
    if (step === 1) {
      subtitle.textContent = 'Step 1: Enter your account details';
    } else if (step === 2) {
      subtitle.textContent = 'Step 2: Choose a secure password';
    } else if (step === 3) {
      subtitle.textContent = 'Step 3: Define your profile and role';
    }

    // Toggle Panes
    panes.forEach((pane, index) => {
      if (index + 1 === step) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  };

  // Navigations Button bindings
  document.getElementById('step1-next-btn').addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();

    if (!username || !email) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please enter a username and email address.',
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    // Simple Email Regex check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    currentStep = 2;
    updateWizardUI(currentStep);
  });

  document.getElementById('step2-back-btn').addEventListener('click', () => {
    currentStep = 1;
    updateWizardUI(currentStep);
  });

  document.getElementById('step2-next-btn').addEventListener('click', () => {
    const password = passwordInput.value;
    const checks = checkPasswordStrength(password);
    const isStrong = Object.values(checks).every(v => v);

    if (!isStrong) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Your password must satisfy all security rules.',
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    currentStep = 3;
    updateWizardUI(currentStep);
  });

  document.getElementById('step3-back-btn').addEventListener('click', () => {
    currentStep = 2;
    updateWizardUI(currentStep);
  });

  // Real-time password check
  passwordInput.addEventListener('input', () => {
    const checks = checkPasswordStrength(passwordInput.value);
    updateChecklistUI(checks);
  });

  // Registration Form Submission (Final Step)
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = fullNameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value;
    const password = passwordInput.value;

    if (!fullName) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'Please enter your full name.',
        confirmButtonColor: '#0f172a'
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
        confirmButtonColor: '#0f172a'
      }).then(() => {
        window.location.href = 'login.html';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'An unexpected error occurred.',
        confirmButtonColor: '#0f172a'
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

  // Parse queries
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get('token');
  const resetToken = urlParams.get('resetToken');

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
          confirmButtonColor: '#0f172a'
        }).then(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: err.response?.data?.error || 'Invalid or expired token.',
          confirmButtonColor: '#0f172a'
        });
      });
  }

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

  // Switches
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    forgotSection.style.display = 'block';
  });

  backToLogin.addEventListener('click', () => {
    forgotSection.style.display = 'none';
    loginSection.style.display = 'block';
  });

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
        confirmButtonColor: '#0f172a'
      });
    }
  });

  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      Swal.fire({
        icon: 'info',
        title: 'Check Your Inbox',
        text: res.data.message,
        confirmButtonColor: '#0f172a'
      }).then(() => {
        forgotSection.style.display = 'none';
        loginSection.style.display = 'block';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.response?.data?.error || 'An error occurred.',
        confirmButtonColor: '#0f172a'
      });
    }
  });

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
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    try {
      const res = await axios.post('/auth/reset-password', { token, newPassword });
      Swal.fire({
        icon: 'success',
        title: 'Reset Complete',
        text: res.data.message,
        confirmButtonColor: '#0f172a'
      }).then(() => {
        window.location.href = 'login.html';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: error.response?.data?.error || 'Failed to reset password.',
        confirmButtonColor: '#0f172a'
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

  try {
    const res = await axios.get('/auth/profile');
    const user = res.data.data;

    // Populate profile details
    profileFullname.textContent = user.fullName;
    profileUsername.textContent = user.username;
    profileEmail.textContent = user.email;
    profileRole.textContent = user.role === 'provider' ? 'Service Provider' : 'Customer';
    
    // Style role box if provider
    if (user.role === 'provider') {
      document.getElementById('p-role-box').style.borderLeftColor = 'var(--warning)';
    }

    headerName.textContent = user.fullName;
    headerRole.textContent = `Role: ${user.role.toUpperCase()}`;

  } catch (error) {
    console.error('Failed to load profile details', error);
  }

  logoutBtn.addEventListener('click', async () => {
    try {
      await axios.post('/auth/logout');
      window.location.href = 'login.html';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'Failed to sign out correctly.',
        confirmButtonColor: '#0f172a'
      });
    }
  });

  logoutAllBtn.addEventListener('click', async () => {
    try {
      await axios.post('/auth/logout-all');
      window.location.href = 'login.html';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'Failed to sign out from all devices.',
        confirmButtonColor: '#0f172a'
      });
    }
  });
}
