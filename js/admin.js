
const table = document.getElementById("appointmentsTable");
const message = document.getElementById("adminMessage");

const appointments = JSON.parse(
  localStorage.getItem("sesaiAppointments") || "[]"
);

if (appointments.length === 0) {
  table.innerHTML = `
    <tr>
      <td colspan="7">No appointments found.</td>
    </tr>
  `;
} else {
  table.innerHTML = appointments.map(appointment => `
    <tr>
      <td>${appointment.name || ""}</td>
      <td>${appointment.phone || ""}</td>
      <td>${appointment.animal || ""}</td>
      <td>${appointment.service || ""}</td>
      <td>${appointment.date || ""}</td>
      <td>${appointment.time || ""}</td>
      <td>${appointment.status || "Requested"}</td>
    </tr>
  `).join("");
}