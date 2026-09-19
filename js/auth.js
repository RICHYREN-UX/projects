
const USERS_KEY = "sesaiUsers";
const SESSION_KEY = "sesaiCurrentUser";

// ===============================
// DISPLAY MESSAGES
// ===============================

function showMessage(element, message, isError = false) {
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#c62828" : "#1f7a45";
}

// ===============================
// GET REGISTERED USERS
// ===============================

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}

// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const message = document.getElementById("registerMessage");

        if (!name || !phone || !email || !password) {
            showMessage(message, "Please fill in all fields.", true);
            return;
        }

        if (password.length < 8) {
            showMessage(message, "Password must be at least 8 characters.", true);
            return;
        }

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            showMessage(message, "This email is already registered. Please login.", true);
            return;
        }

        const newUser = {
            id: crypto.randomUUID(),
            name,
            phone,
            email,
            password
        };

        users.push(newUser);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        showMessage(message, "Account created! Redirecting to login...");

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    });
}

// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");

        const users = getUsers();

        const user = users.find(
            user => user.email === email && user.password === password
        );

        if (!user) {
            showMessage(message, "Incorrect email or password.", true);
            return;
        }

        const currentUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email
        };

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

        showMessage(message, "Login successful! Redirecting...");

        loginForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });
}