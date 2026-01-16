// Функция лайка теперь просто переключает класс визуально,
// но реальная логика обработки клика (API) будет передаваться через колбэк
export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

// Удаление карточки из DOM
export const removeCardElement = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  cardData,
  userId, // ID текущего пользователя для проверок
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Отрисовка количества лайков
  likeCountElement.textContent = cardData.likes.length;

  // Проверка: есть ли мой лайк на карточке
  const isLiked = cardData.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Обработчик лайка
  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      onLikeIcon(likeButton, cardData._id, likeCountElement);
    });
  }

  // Проверка: является ли пользователь владельцем карточки
  // Если нет — удаляем кнопку удаления
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    // Если да — вешаем обработчик удаления
    if (onDeleteCard) {
      deleteButton.addEventListener("click", () => {
        onDeleteCard(cardData._id, cardElement);
      });
    }
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: cardData.name, link: cardData.link })
    );
  }

  return cardElement;
};
