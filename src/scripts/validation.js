export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => {
    form.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(form, settings);
  });
}

function setEventListeners(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, button, settings);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
}

function checkInputValidity(form, input, settings) {
  const errorElement = form.querySelector(`#${input.id}-error`);

  if (!input.validity.valid) {
    showInputError(input, errorElement, input.validationMessage, settings);
  } else {
    hideInputError(input, errorElement, settings);
  }
}

function showInputError(input, errorElement, errorMessage, settings) {
  input.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

function hideInputError(input, errorElement, settings) {
  input.classList.remove(settings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
}

function toggleButtonState(inputs, button, settings) {
  if (hasInvalidInput(inputs)) {
    disableButton(button, settings);
  } else {
    enableButton(button, settings);
  }
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

export function disableButton(button, settings) {
  button.classList.add(settings.inactiveButtonClass);
  button.disabled = true;
}

function enableButton(button, settings) {
  button.classList.remove(settings.inactiveButtonClass);
  button.disabled = false;
}

export function resetValidation(form, inputs, settings) {
  const button = form.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputs, button, settings);

  inputs.forEach((input) => {
    const errorElement = form.querySelector(`#${input.id}-error`);
    hideInputError(input, errorElement, settings);
  });
}
