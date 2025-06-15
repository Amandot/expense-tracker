// scripts.js: Handles Login and Sign-up

// Sign Up logic
const signupBtn = document.getElementById('signup-btn');
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    const email = document.getElementById('signup-email').value; // Changed username to email
    const password = document.getElementById('signup-password').value;

    if (email && password) {
      if (localStorage.getItem(email)) { // Check against email
        alert('User already exists!');
      } else {
        const user = { email, password, expenses: [] }; // Store with email
        localStorage.setItem(email, JSON.stringify(user));
        alert('User signed up successfully!');
        window.location.href = 'login.html';
      }
    } else {
      alert('Please fill in all fields');
    }
  });
}

// Login logic
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value; // Changed username to email
    const password = document.getElementById('login-password').value;

    const user = JSON.parse(localStorage.getItem(email)); // Retrieve user based on email

    if (user && user.password === password) {
      localStorage.setItem('loggedInUser', email); // Store logged in email
      window.location.href = 'exp.html'; // Redirect to expenses page
    } else {
      alert('Invalid email or password');
    }
  });
}
