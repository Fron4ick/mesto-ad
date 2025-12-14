// Функция отображения ошибки
export const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Функция скрытия ошибки
export const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
};

// Функция проверки валидности поля
export const checkInputValidity = (formElement, inputElement, settings) => {
  if (!inputElement.validity.valid) {
    let errorMessage = inputElement.validationMessage;
    
    // Проверка на кастомное сообщение для полей с pattern
    if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
      errorMessage = inputElement.dataset.errorMessage;
    }
    
    // Проверка на кастомное сообщение для URL полей
    if (inputElement.type === 'url' && inputElement.dataset.errorMessage) {
      if (inputElement.validity.typeMismatch || inputElement.validity.valueMissing) {
        errorMessage = inputElement.dataset.errorMessage;
      }
    }
    
    showInputError(formElement, inputElement, errorMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

// Функция проверки наличия невалидных полей
export const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => !inputElement.validity.valid);
};

// Функция отключения кнопки
export const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

// Функция включения кнопки
export const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(settings.inactiveButtonClass);
};

// Функция переключения состояния кнопки
export const toggleButtonState = (inputList, buttonElement, settings, originalValues = {}) => {
  const hasErrors = hasInvalidInput(inputList);
  const hasChanges = Object.keys(originalValues).length > 0 && 
    inputList.some(inputElement => {
      const originalValue = originalValues[inputElement.name];
      return originalValue !== undefined && inputElement.value !== originalValue;
    });
  
  if (hasErrors || (Object.keys(originalValues).length > 0 && !hasChanges)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

// Функция установки обработчиков событий
export const setEventListeners = (formElement, settings, originalValues = {}) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  toggleButtonState(inputList, buttonElement, settings, originalValues);
  
  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings, originalValues);
    });
  });
};

// Функция очистки валидации
export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, settings);
  });
  
  disableSubmitButton(buttonElement, settings);
};

// Функция включения валидации всех форм
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach(formElement => {
    setEventListeners(formElement, settings);
  });
};
