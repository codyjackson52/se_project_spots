import "../pages/index.css";
import { enableValidation } from "../scripts/validate.js";
import Api from "../utils/Api.js";

// ======= Constants =======
const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

let selectedCard = null;
let selectedCardId = null;

// ======= API Setup =======
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3e2f81fe-1cae-4437-b01f-b3b158310921",
    "Content-Type": "application/json",
  },
});

// ======= DOM Elements =======
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardEditButton = document.querySelector(".profile__add-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const avatarImage = document.querySelector(".profile__avatar");
const avatarBtn = document.querySelector(".profile__avatar-edit-btn");

const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const captionInput = cardModal.querySelector("#add-card-name-input");
const linkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");

// ======= Modals =======
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

document.querySelectorAll(".modal__close-btn, .modal__close").forEach((btn) => {
  const modal = btn.closest(".modal");
  btn.addEventListener("click", () => closeModal(modal));
});

[editModal, cardModal, previewModal, avatarModal, deleteModal].forEach(
  (modal) => {
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target === modal) closeModal(modal);
    });
  }
);

// ======= Card Renderer =======
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const title = cardElement.querySelector(".card__title");
  const image = cardElement.querySelector(".card__image");
  const likeBtn = cardElement.querySelector(".card__like-button");
  const deleteBtn = cardElement.querySelector(".card__delete-button");

  title.textContent = data.name;
  image.src = data.link;
  image.alt = data.name;

  image.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  likeBtn.addEventListener("click", () => {
    const isLiked = likeBtn.classList.contains("card__like-button_liked");
    api
      .changeLikeStatus(data._id, isLiked)
      .then(() => likeBtn.classList.toggle("card__like-button_liked"))
      .catch(console.error);
  });

  deleteBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

// ======= Form Handlers =======
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .addCard({
      name: captionInput.value,
      link: linkInput.value,
    })
    .then((data) => {
      cardList.prepend(getCardElement(data));
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .updateAvatar(avatarInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Yes";
    });
}

// ======= Event Listeners =======
editForm.addEventListener("submit", handleEditProfileSubmit);
cardForm.addEventListener("submit", handleCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileNameEl.textContent;
  descriptionInput.value = profileDescriptionEl.textContent;
  openModal(editModal);
});

cardEditButton.addEventListener("click", () => openModal(cardModal));
avatarImage.addEventListener("click", () => openModal(avatarModal));
avatarBtn.addEventListener("click", () => openModal(avatarModal));

// ======= Load Data =======
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    avatarImage.src = user.avatar;
    cards.reverse().forEach((card) => cardList.append(getCardElement(card)));
  })
  .catch(console.error);

// ======= Validation =======
enableValidation(validationConfig);
