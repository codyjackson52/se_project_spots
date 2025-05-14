export function setButtonText(
  button,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save"
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}
