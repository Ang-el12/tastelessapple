function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // convert to 12h format

  document.getElementById("clock").textContent = `${hours}:${minutes} ${ampm}`;
}

// update every second
setInterval(updateClock, 1000);
updateClock(); // run immediately