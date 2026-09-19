
"use strict";

// ===============================
// MOBILE NAVIGATION
// ===============================

const mobileBtn = document.getElementById("mobileBtn");
const navMenu = document.getElementById("navMenu");

if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
        navMenu.classList.toggle("show");

        const icon = mobileBtn.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show");

            const icon = mobileBtn.querySelector("i");

            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }
        });
    });
}

// ===============================
// ACTIVE NAVIGATION
// ===============================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );
    });
});

// ===============================
// APPOINTMENT BOOKING
// ===============================

const appointmentForm =
    document.getElementById("appointmentForm");

if (appointmentForm) {
    const formMessage =
        document.getElementById("formMessage");

    const currentUser = (() => {
        try {
            return JSON.parse(
                sessionStorage.getItem("sesaiCurrentUser")
            );
        } catch {
            return null;
        }
    })();

    // Set the minimum appointment date to today.
    const dateInput = appointmentForm.querySelector("#date");

    if (dateInput) {
        const today = new Date();
        const localDate = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        dateInput.min = localDate;
    }

    // Pre-fill client details when logged in.
    if (currentUser) {
        const nameInput = appointmentForm.querySelector("#name");
        const phoneInput = appointmentForm.querySelector("#phone");

        if (nameInput) nameInput.value = currentUser.name || "";
        if (phoneInput) phoneInput.value = currentUser.phone || "";
    }

    appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!currentUser) {
            if (formMessage) {
                formMessage.textContent =
                    "Please log in before requesting an appointment.";
                formMessage.style.color = "#c62828";
            }

            window.location.href = "login.html";
            return;
        }

        const name =
            appointmentForm.querySelector("#name").value.trim();

        const phone =
            appointmentForm.querySelector("#phone").value.trim();

        const animal =
            appointmentForm.querySelector("#animal").value;

        const service =
            appointmentForm.querySelector("#service").value;

        const date =
            appointmentForm.querySelector("#date").value;

        const time =
            appointmentForm.querySelector("#time").value;

        const message =
            appointmentForm.querySelector("#message").value.trim();

        if (!name || !phone || !animal || !service || !date || !time) {
            if (formMessage) {
                formMessage.textContent =
                    "Please complete all required fields.";
                formMessage.style.color = "#c62828";
            }
            return;
        }

        const appointmentDate = new Date(`${date}T${time}`);
        if (Number.isNaN(appointmentDate.getTime()) ||
            appointmentDate <= new Date()) {
            if (formMessage) {
                formMessage.textContent =
                    "Please select a future appointment date and time.";
                formMessage.style.color = "#c62828";
            }
            return;
        }

        const appointment = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            name,
            phone,
            animal,
            service,
            date,
            time,
            message,
            status: "Requested",
            createdAt: new Date().toISOString()
        };

        let appointments = [];

        try {
            appointments = JSON.parse(
                localStorage.getItem("sesaiAppointments")
            ) || [];
        } catch {
            appointments = [];
        }

        appointments.push(appointment);

        try {
            localStorage.setItem(
                "sesaiAppointments",
                JSON.stringify(appointments)
            );
        } catch {
            if (formMessage) {
                formMessage.textContent =
                    "Unable to save appointment in this browser.";
                formMessage.style.color = "#c62828";
            }
            return;
        }

        const whatsappMessage = [
            "Hello Sesai Vetcare,",
            "",
            "I would like to request an appointment.",
            "",
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Animal: ${animal}`,
            `Service: ${service}`,
            `Date: ${date}`,
            `Time: ${time}`,
            `Message: ${message || "Not provided"}`,
            "",
            "Status: Requested"
        ].join("\n");

        const whatsappURL =
            "https://wa.me/254799412039?text=" +
            encodeURIComponent(whatsappMessage);

        if (formMessage) {
            formMessage.textContent =
                "Appointment saved in this browser. WhatsApp will open so you can send your request.";
            formMessage.style.color = "#1f7a45";
        }

        window.open(whatsappURL, "_blank");

        appointmentForm.reset();

        // Restore pre-filled user details.
        if (appointmentForm.querySelector("#name")) {
            appointmentForm.querySelector("#name").value =
                currentUser.name || "";
        }

        if (appointmentForm.querySelector("#phone")) {
            appointmentForm.querySelector("#phone").value =
                currentUser.phone || "";
        }
    });
}

// ===============================
// CURRENT YEAR
// ===============================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ===============================
// NAVBAR SCROLL EFFECT
// ===============================

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        navbar.style.boxShadow =
            window.scrollY > 50
                ? "0 5px 25px rgba(0,0,0,.18)"
                : "0 4px 20px rgba(0,0,0,.12)";
    }
});