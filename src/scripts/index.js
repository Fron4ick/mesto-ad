import "../pages/index.css"; // Импорт стилей (если Vite требует)
import { createCardElement, likeCard, removeCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation, checkInputValidity, toggleButtonState } from "./components/validation.js";
import {
  getUserInfo,
  getCards,
  updateUserInfo,
  addNewCard,
  updateUserAvatar,
  deleteCardApi,
  changeLikeStatus,
} from "./components/api.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");

// Попап редактирования профиля
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileSubmitButton = profileForm.querySelector(".popup__button");

// Попап новой карточки
const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardSubmitButton = cardForm.querySelector(".popup__button");

// Попап картинки
const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

// Попап аватара
const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const avatarSubmitButton = avatarForm.querySelector(".popup__button");

// Кнопки открытия попапов
const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

// Элементы профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

// Глобальная переменная для ID пользователя
let currentUserId = null;

// Настройки валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// --- Функции UX (Loading) ---
const renderLoading = (isLoading, buttonElement, initialText = "Сохранить", loadingText = "Сохранение...") => {
  if (isLoading) {
    buttonElement.textContent = loadingText;
  } else {
    buttonElement.textContent = initialText;
  }
};

// --- Обработчики ---

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

// Обработчик лайка (связь с API)
const handleLikeCard = (likeButton, cardId, likeCountElement) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  
  changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      // Обновляем визуально лайк и счетчик
      likeCard(likeButton);
      likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

// Обработчик удаления карточки (связь с API)
const handleDeleteCard = (cardId, cardElement) => {
  // Простое удаление без подтверждения (по основному заданию)
  deleteCardApi(cardId)
    .then(() => {
      removeCardElement(cardElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Сабмит формы профиля
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(true, profileSubmitButton);

  updateUserInfo(profileTitleInput.value, profileDescriptionInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, profileSubmitButton);
    });
};

// Сабмит формы аватара
const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton);

  updateUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, avatarSubmitButton);
    });
};

// Сабмит новой карточки
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(true, cardSubmitButton, "Создать", "Создание...");

  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then((cardData) => {
      const newCard = createCardElement(cardData, currentUserId, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: handleLikeCard,
        onDeleteCard: handleDeleteCard,
      });
      placesWrap.prepend(newCard);
      closeModalWindow(cardFormModalWindow);
      // Очистка формы происходит при открытии (reset в слушателе клика) или можно тут: cardForm.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, cardSubmitButton, "Создать");
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Открытие профиля
openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

// Открытие аватара
profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

// Открытие добавления карточки
openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

// Настройка закрытия всех попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// Включение валидации
enableValidation(validationSettings);

// --- Инициализация данных ---
Promise.all([getUserInfo(), getCards()])
  .then(([userData, cardsData]) => {
    // 1. Сохраняем ID и отрисовываем профиль
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    // 2. Отрисовываем карточки
    cardsData.forEach((cardData) => {
      const cardElement = createCardElement(cardData, currentUserId, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: handleLikeCard,
        onDeleteCard: handleDeleteCard,
      });
      placesWrap.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });