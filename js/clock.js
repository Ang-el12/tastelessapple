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

//------------------------------------//
//// Tab functionality with toggle//

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");
  const container = document.querySelector(".tab-content");
  let lockedTab = null;

  function showPanel(button, panel) {
    buttons.forEach(btn => btn.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    button.classList.add("active");
    panel.classList.add("active");
    container.classList.add("active"); // show container
  }

  function hidePanel(button, panel) {
    if (lockedTab === button) return;
    button.classList.remove("active");
    panel.classList.remove("active");

    // if no panel is active, hide container
    if (![...panels].some(p => p.classList.contains("active"))) {
      container.classList.remove("active");
    }
  }

  buttons.forEach(button => {
    const tabId = button.getAttribute("data-tab");
    const targetPanel = document.getElementById(tabId);

    // Hover preview
    button.addEventListener("mouseenter", () => {
      if (!lockedTab) {
        showPanel(button, targetPanel);
      }
    });

    button.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!targetPanel.matches(":hover") && !button.matches(":hover") && lockedTab !== button) {
          hidePanel(button, targetPanel);
        }
      }, 200);
    });

    targetPanel.addEventListener("mouseleave", () => {
      if (lockedTab !== button) {
        hidePanel(button, targetPanel);
      }
    });

    // Click to lock/unlock
    button.addEventListener("click", () => {
      if (lockedTab === button) {
        // unlock
        lockedTab = null;
        hidePanel(button, targetPanel);
      } else {
        // lock this one
        lockedTab = button;
        showPanel(button, targetPanel);
      }
    });
  });
});