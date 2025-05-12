import "../pages/index.css";
import { enableValidation } from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

let selectedCard = null;
let selectedCardId = null;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3e2f81fe-1cae-4437-b01f-b3b158310921",
    "Content-Type": "application/json",
  },
});

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardEditButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarImage = document.querySelector(".profile__avatar");
const avatarEditButton = document.querySelector(".profile__avatar-edit-btn");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editSubmitBtn = editFormElement.querySelector(".modal__submit-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardnameInput = cardModal.querySelector("#add-card-name-input");
const cardlinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal.querySelector(".modal__image");
const modalCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteSubmitBtn = deleteForm.querySelector(".modal__submit-btn");
const cancelBtn = document.querySelector(".modal__cancel-btn");
cancelBtn.addEventListener("click", () => closeModal(deleteModal));

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarImage.src = userData.avatar;

    cards.forEach((cardData) => {
      const card = getCardElement(cardData);
      cardList.prepend(card);
    });
  })
  .catch(console.error);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-button_liked");
    api
      .changeLikeStatus(data._id, isLiked)
      .then(() => {
        cardLikeBtn.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  });

  cardDeleteBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  setButtonText(deleteSubmitBtn, true, "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(deleteSubmitBtn, false, "Deleting...", "Yes"));
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value;
  setButtonText(avatarSubmitBtn, true);
  api
    .updateAvatar(avatarUrl)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(avatarSubmitBtn, false));
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const userData = {
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value,
  };
  setButtonText(editSubmitBtn, true);
  api
    .editUserInfo(userData)
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(editSubmitBtn, false));
});

cardEditButton.addEventListener("click", () => openModal(cardModal));

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const cardData = {
    name: cardnameInput.value,
    link: cardlinkInput.value,
  };
  setButtonText(cardSubmitBtn, true);
  api
    .addCard(cardData)
    .then((newCard) => {
      const card = getCardElement(newCard);
      cardList.prepend(card);
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(cardSubmitBtn, false));
});

avatarImage.addEventListener("click", () => openModal(avatarModal));
avatarEditButton.addEventListener("click", () => openModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

const closeButtons = document.querySelectorAll(
  ".modal__close-btn, .modal__close"
);
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

[editModal, cardModal, previewModal, avatarModal, deleteModal].forEach(
  (modal) => {
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target === modal) closeModal(modal);
    });
  }
);

enableValidation({
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
});
