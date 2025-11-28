/**
 * This script is used to add the disabled-link class to the active page in the menu bar.
 */
document.addEventListener("DOMContentLoaded", () => {   
  const currentPath = window.location.pathname;
  const fileName = currentPath.split('/').pop();
  const pageMapping = {
    'summary.html': 'summary-btn',
    'add_task.html': 'add-task-btn',
    'board.html': 'board-btn',
    'contacts.html': 'contacts-btn',
    'privacy_policy.html': 'privacy-btn',
    'legal_notice.html': 'legal-link'
  };
  const activeClass = pageMapping[fileName];
  if (activeClass) {
    const element = document.querySelector(`.${activeClass}`);
    if (element) element.classList.add('disabled-link');
  }
});