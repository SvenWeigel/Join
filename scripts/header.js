// Set user avatar initials from localStorage.currentUser.name
const STORAGE_KEY = 'currentUser';

function getInitials(name) {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0).toUpperCase() : '';
  const second = parts[1] ? parts[1].charAt(0).toUpperCase() : '';
  return (first + second).slice(0, 2);
}

function readUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function updateAvatars(initials, fullName) {
  const nodes = document.querySelectorAll('.user-avatar');
  if (!nodes || nodes.length === 0) return;
  nodes.forEach((el) => {
    el.textContent = initials || '?';
    const badge = el.closest('.user-badge');
    if (badge && fullName) badge.setAttribute('title', fullName);
  });
}

function applyInitials() {
  const user = readUserFromStorage();
  const name = user && user.name ? user.name : '';
  const initials = getInitials(name) || '?';
  updateAvatars(initials, name);
}

// Call on load and expose for manual invocation/tests
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyInitials);
} else {
  applyInitials();
}

window.applyInitials = applyInitials;
