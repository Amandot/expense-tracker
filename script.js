// User.js: Handles Login and Sign-up

// Function to get the currently logged-in user
function getCurrentUser() {
  return localStorage.getItem('loggedInUser');
}

// Sign Up logic
const signupBtn = document.querySelector('#signup-form button');
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      if (email && password) {
          if (localStorage.getItem(email)) {
              alert('User already exists!');
          } else {
              const user = { email, password, expenses: [] };
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
const loginBtn = document.querySelector('#login-form button');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      const user = JSON.parse(localStorage.getItem(email));

      if (user && user.password === password) {
          localStorage.setItem('loggedInUser', email);
          window.location.href = 'exp.html';
      } else {
          alert('Invalid email or password');
      }
  });
}

// Expense tracker logic
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Initialize transactions for the logged-in user
function initializeTransactions() {
  const currentUser = getCurrentUser();
  if (currentUser) {
      const userData = JSON.parse(localStorage.getItem(currentUser));
      return userData.expenses || [];
  }
  return [];
}

let transactions = initializeTransactions();

// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
      alert('Please add text and amount');
  } else {
      const transaction = {
          id: generateID(),
          text: text.value,
          amount: +amount.value,
      };

      transactions.push(transaction);
      updateUserData();
      addTransactionDOM(transaction);
      updateValues();
      text.value = '';
      amount.value = '';
  }
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transactions to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update the balance income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `₹${total}`;
  money_plus.innerText = `₹${income}`;
  money_minus.innerText = `₹${expense}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateUserData();
  Init();
}

// Update user data in local storage
function updateUserData() {
  const currentUser = getCurrentUser();
  if (currentUser) {
      const userData = JSON.parse(localStorage.getItem(currentUser));
      userData.expenses = transactions;
      localStorage.setItem(currentUser, JSON.stringify(userData));
  }
}

// Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();

form.addEventListener('submit', addTransaction);
