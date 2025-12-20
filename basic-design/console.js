document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const authForm = document.getElementById("authForm"); // Login/Signup
  const emailForm = document.getElementById("emailForm");
  const otpForm = document.getElementById("otpForm");
  const newPasswordForm = document.getElementById("newPasswordForm");

  const notification = document.querySelector(".form-notification");
  const notificationText = document.querySelector(".notification-text");
  const card = document.querySelector(".card");
  const loader = document.querySelector(".logo-loading");

  let generatedOTP = null;

  // --- 1. Render DOB options ---
  const monthSelect = document.getElementById("month");
  const dateSelect = document.getElementById("date");
  const yearSelect = document.getElementById("year");

  if (monthSelect && dateSelect && yearSelect) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    months.forEach((month, i) => {
      const opt = document.createElement("option");
      opt.value = i + 1;
      opt.textContent = month;
      monthSelect.appendChild(opt);
    });
    for (let i = 1; i <= 31; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      dateSelect.appendChild(opt);
    }
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      yearSelect.appendChild(opt);
    }
  }

  // --- 2. Draft Auto-save ---
  const allInputs = document.querySelectorAll("input, select");
  allInputs.forEach((input) => {
    if (input.type === "password" || input.classList.contains("otp-input"))
      return;

    const savedValue = localStorage.getItem("draft_" + input.id);
    if (savedValue) {
      if (input.type === "checkbox") input.checked = savedValue === "true";
      else if (input.type === "radio") {
        if (input.value === savedValue) input.checked = true;
      } else input.value = savedValue;
    }

    input.addEventListener("input", (e) => {
      if (e.target.type === "password") return;
      localStorage.setItem(
        "draft_" + e.target.id,
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      );
    });

    input.addEventListener("focus", () => notification.classList.add("hidden"));
  });

  // --- 3. UI Helpers ---
  function showLoader() {
    card.style.display = "none";
    loader.classList.remove("hidden");
  }
  function hideLoader() {
    card.style.display = "flex";
    loader.classList.add("hidden");
  }
  function showMessage(msg, color) {
    notification.classList.remove("hidden");
    notificationText.textContent = msg;
    notification.style.background = color === "green" ? "#4caf50" : "#ff4d4d";
    notificationText.style.color = "#fff";
  }

  // --- 4. Time Formatter for Password Change ---
  function formatElapsedTime(oldDate) {
    const now = new Date();
    const diff = now - oldDate; // in ms
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} second(s) ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute(s) ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour(s) ago`;
    const days = Math.floor(hours / 24);
    if (days < 365) return `${days} day(s) ago`;
    const years = Math.floor(days / 365);
    if (years < 100) return `${years} year(s) ago`;
    const centuries = Math.floor(years / 100);
    return `${centuries} century(ies) ago`;
  }

  // --- 5. Login / Signup ---
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = authForm.dataset.type;
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      let valid = true;
      authForm
        .querySelectorAll("input:not([type=checkbox]), select")
        .forEach((i) => {
          if (!i.value.trim()) valid = false;
        });
      if (!valid) {
        showMessage("Please fill all fields", "red");
        return;
      }

      showLoader();
      setTimeout(() => {
        hideLoader();

        const storedEmail = localStorage.getItem("registered_email");
        const storedPass = localStorage.getItem("registered_password");
        const lastPassChange = localStorage.getItem("last_password_change");
        const oldPasswords = JSON.parse(
          localStorage.getItem("old_passwords") || "[]"
        );

        if (type === "signup") {
          localStorage.setItem("registered_email", emailInput.value);
          localStorage.setItem("registered_password", passwordInput.value);
          localStorage.setItem(
            "last_password_change",
            new Date().toISOString()
          );
          localStorage.setItem("old_passwords", JSON.stringify([]));
          showMessage("Account created! Redirecting to login...", "green");
          setTimeout(() => (window.location.href = "index.html"), 2000);
        } else if (type === "login") {
          if (emailInput.value !== storedEmail) {
            showMessage("Email not registered", "red");
            return;
          }

          if (passwordInput.value === storedPass) {
            showMessage("Logged in successfully!", "green");
            localStorage.removeItem("draft_email");
          } else if (oldPasswords.includes(passwordInput.value)) {
            if (lastPassChange) {
              const last = new Date(lastPassChange);
              const elapsed = formatElapsedTime(last);
              showMessage(
                `You entered an old password. Last changed: ${elapsed}`,
                "red"
              );
            } else {
              showMessage("You entered an old password.", "red");
            }
          } else {
            showMessage("Incorrect password", "red");
          }
        }
      }, 1500);
    });
  }

  // --- 6. Forgot Password Flow ---
  if (emailForm) {
    emailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("resetEmail");
      const registeredEmail = localStorage.getItem("registered_email");

      if (emailInput.value !== registeredEmail) {
        showMessage("Email address not found", "red");
        return;
      }

      showLoader();
      setTimeout(() => {
        hideLoader();
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        showMessage(`Your Verification Code is: ${generatedOTP}`, "green");

        setTimeout(() => {
          emailForm.classList.add("hidden");
          otpForm.classList.remove("hidden");
          document.getElementById("pageSubtitle").textContent =
            "Enter the 6-digit code sent to your email";
          const firstOtp = document.querySelector(".otp-input");
          if (firstOtp) firstOtp.focus();
        }, 2000);
      }, 1500);
    });

    // OTP Auto-focus
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        if (input.value.length === 1 && index < otpInputs.length - 1)
          otpInputs[index + 1].focus();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value.length === 0 && index > 0)
          otpInputs[index - 1].focus();
      });
    });

    // OTP Verification
    otpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let inputOTP = "";
      otpInputs.forEach((i) => (inputOTP += i.value));
      if (inputOTP !== generatedOTP) {
        showMessage("Invalid Code. Please try again.", "red");
        return;
      }
      showLoader();
      setTimeout(() => {
        hideLoader();
        showMessage("Code Verified!", "green");
        otpForm.classList.add("hidden");
        newPasswordForm.classList.remove("hidden");
        document.getElementById("pageSubtitle").textContent =
          "Create a new password";
      }, 1000);
    });

    // Reset Password
    newPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newPass = document.getElementById("newPassword").value;
      const confirmPass = document.getElementById("confirmPassword").value;

      if (newPass.length < 4) {
        showMessage("Password must be at least 4 characters", "red");
        return;
      }
      if (newPass !== confirmPass) {
        showMessage("Passwords do not match", "red");
        return;
      }

      showLoader();
      setTimeout(() => {
        hideLoader();

        const oldPasswords = JSON.parse(
          localStorage.getItem("old_passwords") || "[]"
        );
        const currentPass = localStorage.getItem("registered_password");
        if (currentPass) oldPasswords.push(currentPass);
        localStorage.setItem("old_passwords", JSON.stringify(oldPasswords));

        localStorage.setItem("registered_password", newPass);
        localStorage.setItem("last_password_change", new Date().toISOString());

        showMessage("Password Reset Successfully! Redirecting...", "green");
        setTimeout(() => (window.location.href = "index.html"), 2000);
      }, 1500);
    });
  }
});
