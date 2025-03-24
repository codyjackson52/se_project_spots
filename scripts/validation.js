// make sure each class is matching

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled", // dont have this
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible", //dont have this
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`); //formEl might need to be "document"
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(config.inputErrorClass);
  errorMsgEl.classList.add(config.errorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`); // formEl might need to be "document"
  errorMsgEl.textContent = "";
  inputEl.classList.remove(config.inputErrorClass);
  errorMsgEl.classList.remove(config.errorClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, config);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
};

const disableButton = (buttonEl, config) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(config.inactiveButtonClass); // settings might be "config"
};
// TO DO Add a modifier class to buttonEL to make it grey
// Dont forget the CSS

// Optional
const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
  });
};

// TO DO - use the setting object in all functions instead of hard-coded string

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    formEl.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });

    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
