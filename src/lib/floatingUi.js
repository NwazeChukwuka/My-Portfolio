const ROOT = () => document.documentElement;

export const resetFloatingUiOffsets = () => {
  const root = ROOT();
  root.style.setProperty('--floating-chat-offset', '0px');
  root.style.setProperty('--floating-chat-bottom-offset', '0px');
};

export const setFloatingUiOffsets = ({ rightOffset = 0, bottomOffset = 0 } = {}) => {
  const root = ROOT();
  root.style.setProperty('--floating-chat-offset', `${Math.max(0, Number(rightOffset) || 0)}px`);
  root.style.setProperty('--floating-chat-bottom-offset', `${Math.max(0, Number(bottomOffset) || 0)}px`);
};

// Register one floating widget and keep the back-to-top button clear of it.
export const registerFloatingWidget = ({ width = 64, height = 64, gap = 16 } = {}) => {
  setFloatingUiOffsets({
    rightOffset: Number(width) + Number(gap),
    bottomOffset: Number(height) + Number(gap),
  });
};
