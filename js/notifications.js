// Notifications/Toast system
export function notify(message, toastRoot) {
  const toast = document.createElement('div');
  toast.className = 'toast glass-border';
  toast.textContent = message;
  toastRoot.appendChild(toast);

  setTimeout(() => {
    toast.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(20px)' }
      ],
      { duration: 450, easing: 'ease' }
    );

    setTimeout(() => toast.remove(), 450);
  }, 2200);
}

export function triggerCartPulse(buttonId = 'cartButton') {
  const button = document.querySelector(`#${buttonId}`);
  if (!button) return;

  button.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.08)' },
      { transform: 'scale(1)' }
    ],
    { duration: 320, easing: 'ease-out' }
  );
}
