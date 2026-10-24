// DOM Elements
const authBox = document.getElementById('auth-box');
const dashboardBox = document.getElementById('dashboard-box');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');

const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const showForgotBtn = document.getElementById('show-forgot');
const backToLoginBtn = document.getElementById('back-to-login');

const alertBox = document.getElementById('alert-box');
const logoutBtn = document.getElementById('logout-btn');
const userDisplayName = document.getElementById('user-display-name');
const userDisplayEmail = document.getElementById('user-display-email');
const authSubtitle = document.getElementById('auth-subtitle');

// Switch Forms
showRegisterBtn.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  forgotForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  authSubtitle.textContent = 'Create a new secure account';
  hideAlert();
});

showLoginBtn.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  forgotForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  authSubtitle.textContent = 'Access your portal securely';
  hideAlert();
});

showForgotBtn.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  forgotForm.classList.remove('hidden');
  authSubtitle.textContent = 'Reset your account password';
  hideAlert();
});

backToLoginBtn.addEventListener('click', () => {
  forgotForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  authSubtitle.textContent = 'Access your portal securely';
  hideAlert();
});

// Show Alert Helper
function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert-box ${type}`;
}

function hideAlert() {
  alertBox.textContent = '';
  alertBox.className = 'alert-box hidden';
}

// Toggle Password Hide / Show Visibility
function togglePasswordVisibility(inputId, iconElement) {
  const passwordInput = document.getElementById(inputId);

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    iconElement.classList.remove('fa-eye');
    iconElement.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    iconElement.classList.remove('fa-eye-slash');
    iconElement.classList.add('fa-eye');
  }
}

// Register User
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;

  let users = JSON.parse(localStorage.getItem('oibsip_users')) || [];

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    showAlert('Email already registered! Please login.', 'error');
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem('oibsip_users', JSON.stringify(users));

  showAlert('Registration successful! Please login.', 'success');
  registerForm.reset();
  setTimeout(() => {
    showLoginBtn.click();
  }, 1200);
});

// Login User
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  let users = JSON.parse(localStorage.getItem('oibsip_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showAlert('Invalid email or password!', 'error');
    return;
  }

  localStorage.setItem('oibsip_active_user', JSON.stringify(user));
  loadDashboard(user);
});

// Forgot Password Handler
forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value.trim().toLowerCase();
  const newPassword = document.getElementById('new-password').value;

  let users = JSON.parse(localStorage.getItem('oibsip_users')) || [];
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    showAlert('Email not found in our records!', 'error');
    return;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem('oibsip_users', JSON.stringify(users));

  showAlert('Password reset successful! Please login.', 'success');
  forgotForm.reset();
  setTimeout(() => {
    backToLoginBtn.click();
  }, 1200);
});

// Load Dashboard View
function loadDashboard(user) {
  authBox.classList.add('hidden');
  dashboardBox.classList.remove('hidden');
  userDisplayName.textContent = user.name;
  userDisplayEmail.textContent = user.email;
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('oibsip_active_user');
  dashboardBox.classList.add('hidden');
  authBox.classList.remove('hidden');
  loginForm.reset();
  hideAlert();
});

// Check Session on Page Load
window.addEventListener('DOMContentLoaded', () => {
  const activeUser = JSON.parse(localStorage.getItem('oibsip_active_user'));
  if (activeUser) {
    loadDashboard(activeUser);
  }
});