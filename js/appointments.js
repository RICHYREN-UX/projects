
"use strict";

const SESSION_KEY = "sesaiCurrentUser";
const APPOINTMENTS_KEY = "sesaiAppointments";

let currentUser;

try {
    currentUser = JSON.parse(
        sessionStorage.getItem(SESSION_KEY)
    );
} catch {
    currentUser = null;
}

if (!currentUser) {
    window.location.href = "login.html";
} else {
    document.getElementById("welcomeMessage").textContent =
        `Welcome, ${currentUser.name}`;

    displayAppointments();
}

function displayAppointments() {
    const container =
        document.getElementById("appointmentsList");

    let appointments = [];

    try {
        appointments = JSON.parse(
            localStorage.getItem(APPOINTMENTS_KEY)
        ) || [];
    } catch {
        appointments = [];
    }

    const userAppointments = appointments.filter(
        appointment => appointment.userId === currentUser.id
    );

    container.replaceChildren();

    if (userAppointments.length === 0) {
        container.textContent =
            "You have no appointments yet.";
        return;
    }

    userAppointments.forEach(appointment => {
        const card = document.createElement("div");

        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "10px";
        card.style.padding = "15px";
        card.style.marginBottom = "15px";

        const heading = document.createElement("h3");
        heading.textContent = appointment.service;

        const details = document.createElement("p");

        details.textContent =
            `Animal: ${appointment.animal} | ` +
            `Date: ${appointment.date} | ` +
            `Time: ${appointment.time}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${appointment.status}`;

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Request";
        cancelButton.type = "button";

        cancelButton.addEventListener("click", () => {
            cancelAppointment(appointment.id);
        });

        card.append(heading, details, status, cancelButton);
        container.appendChild(card);
    });
}

function cancelAppointment(id) {
    const confirmed = window.confirm(
        "Are you sure you want to cancel this appointment request?"
    );

    if (!confirmed) return;

    let appointments = [];

    try {
        appointments = JSON.parse(
            localStorage.getItem(APPOINTMENTS_KEY)
        ) || [];
    } catch {
        appointments = [];
    }

    const updatedAppointments = appointments.map(appointment => {
        if (
            appointment.id === id &&
            appointment.userId === currentUser.id
        ) {
            return {
                ...appointment,
                status: "Cancellation requested"
            };
        }

        return appointment;
    });

    localStorage.setItem(
        APPOINTMENTS_KEY,
        JSON.stringify(updatedAppointments)
    );

    displayAppointments();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
});