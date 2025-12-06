document.getElementById("todo-div").addEventListener("click", function() {
    window.location.href = "/html/board.html";
});

document.getElementById("done-div").addEventListener("click", function() {
    window.location.href = "/html/board.html";
});

document.getElementById("priority-date-div").addEventListener("click", function() {
    window.location.href = "/html/board.html";
});

document.getElementById("tasks-in-board-div").addEventListener("click", function() {
    window.location.href = "/html/board.html";
});

document.getElementById("tasks-in-progress-div").addEventListener("click", function() {
    window.location.href = "/html/board.html";
});

document.getElementById("awaiting-feedback-div").addEventListener("click", function() {
    window.location.href = "/html/board.html";
});

function handleGreetOverlay() {
    const overlay = document.getElementById('greetOverlay');
    if (!overlay) return;
    if (window.innerWidth <= 1350) {
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.classList.add('hide');
        setTimeout(() => overlay.style.display = 'none', 500); // nach Animation ausblenden
      }, 2000);
    } else {
      overlay.style.display = 'none';
    }
  }
  window.addEventListener('DOMContentLoaded', handleGreetOverlay);
  window.addEventListener('resize', handleGreetOverlay);