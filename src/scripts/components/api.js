import axios from "axios";

const config = {
  baseURL: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "4e43de94-7832-4553-96cf-bd02324cceb1",
    "Content-Type": "application/json",
  },
};

// Функция обработки ответа (хоть axios сам выбрасывает ошибку при статусах 4xx/5xx,
// оставим для совместимости с логикой задания, если нужно получить именно body)
const getResponseData = (res) => {
  return res.data;
};

// Получение данных пользователя
export const getUserInfo = () => {
  return axios.get("/users/me", config).then(getResponseData);
};

// Получение карточек
export const getCards = () => {
  return axios.get("/cards", config).then(getResponseData);
};

// Обновление данных профиля
export const updateUserInfo = (name, about) => {
  return axios
    .patch(
      "/users/me",
      {
        name: name,
        about: about,
      },
      config
    )
    .then(getResponseData);
};

// Обновление аватара
export const updateUserAvatar = (avatarLink) => {
  return axios
    .patch(
      "/users/me/avatar",
      {
        avatar: avatarLink,
      },
      config
    )
    .then(getResponseData);
};

// Добавление новой карточки
export const addNewCard = (name, link) => {
  return axios
    .post(
      "/cards",
      {
        name: name,
        link: link,
      },
      config
    )
    .then(getResponseData);
};

// Удаление карточки
export const deleteCardApi = (cardId) => {
  return axios.delete(`/cards/${cardId}`, config).then(getResponseData);
};

// Постановка и снятие лайка
export const changeLikeStatus = (cardId, isLiked) => {
  if (isLiked) {
    // Если лайк стоит, отправляем DELETE
    return axios.delete(`/cards/${cardId}/likes`, config).then(getResponseData);
  } else {
    // Если лайка нет, отправляем PUT
    return axios.put(`/cards/${cardId}/likes`, null, config).then(getResponseData);
  }
};