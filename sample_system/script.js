// Password toggle
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('input[type="password"]');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Login button
const loginButton = document.querySelector('button[type="submit"]');
const emailInput = document.querySelector('input[type="email"]');

loginButton.addEventListener('click', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const demoEmail = "user@example.com";
    const demoPassword = "password123";

    if (!email || !password) {
        showCardBanner("Please fill in all fields", "warning");
        showToast("Please fill in all fields", "warning");
        return;
    }

    if (email === demoEmail && password === demoPassword) {
        showCardBanner("Login successful!", "success");
        showToast("Login successful!", "success");
        emailInput.value = "";
        passwordInput.value = "";
    } else {
        showCardBanner("Invalid email or password", "error");
        showToast("Invalid email or password", "error");
    }
});

// Banner inside login card
function showCardBanner(message, type) {
    const banner = document.getElementById('card-banner');
    const iconClass = type === 'success'
        ? 'fas fa-circle-check'
        : type === 'warning'
            ? 'fas fa-triangle-exclamation'
            : 'fas fa-circle-xmark';

    banner.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    banner.className = `card-banner ${type} show`;

    setTimeout(() => {
        banner.classList.remove('show');
        banner.classList.add('hidden');
    }, 3000);
}

// Toast notification (top center)
function showToast(message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const iconClass = type === 'success'
        ? 'fas fa-circle-check'
        : type === 'warning'
            ? 'fas fa-triangle-exclamation'
            : 'fas fa-circle-xmark';

    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
