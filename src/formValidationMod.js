// formValidationMod.js

//declarations
const form1 = document.querySelector("#form-1");

const emailInput = document.querySelector("#email-input");
const countryInput = document.querySelector("#country-input");
const zipCodeInput = document.querySelector("#zip-code-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");

// ======================================== Major Functions ======================================== //

export function initFormValidation() {
  addELtoFromSubmit();
  addELsToFormInputs();
}

// ======================================== ELs ======================================== //

function addELtoFromSubmit() {
  form1.addEventListener("submit", (event) => {
    if (form1.checkValidity()) {
      console.log("high five");
      form1.reset();
    } else {
      // showFormInputError(event);
      console.log("error in form");
    }

    //novalidate is turned on in html
    //prevent all  form submissions to avoid page refresh
    event.preventDefault();
  });
}

function addELsToFormInputs() {
  emailInput.addEventListener("blur", () => {
    showEmailErrorMessage();
  });

  countryInput.addEventListener("blur", () => {
    showCountryErrorMessage();
  });

  zipCodeInput.addEventListener("blur", () => {
    showZipErrorMessage();
  });

  passwordInput.addEventListener("blur", () => {
    showPasswordErrorMessage();
  });

  confirmPasswordInput.addEventListener("blur", () => {
    showConfirmPasswordErrorMessage();
  });
}

// ======================================== Functions ======================================== //

function showEmailErrorMessage() {
  //get errorMessageElm and error message
  const errorElm = getErrorElm(emailInput);
  const errorMessage = getErrorMessage(emailInput);
  setErrorMessage(errorElm, errorMessage);
}

function showCountryErrorMessage() {
  //get errorMessageElm and error message
  const errorElm = getErrorElm(countryInput);
  const errorMessage = getErrorMessage(countryInput);
  setErrorMessage(errorElm, errorMessage);
}

function showZipErrorMessage() {
  //get errorMessageElm and error message
  const errorElm = getErrorElm(zipCodeInput);
  const errorMessage = getErrorMessage(zipCodeInput);
  setErrorMessage(errorElm, errorMessage);
}

function showPasswordErrorMessage() {
  //get errorMessageElm and error message
  const errorElm = getErrorElm(passwordInput);
  const errorMessage = getErrorMessage(passwordInput);
  setErrorMessage(errorElm, errorMessage);
}

function showConfirmPasswordErrorMessage() {
  //get errorMessageElm and error message
  const errorElm = getErrorElm(confirmPasswordInput);
  const errorMessage = getErrorMessage(confirmPasswordInput);
  setErrorMessage(errorElm, errorMessage);
}

function getErrorMessage(inputElm) {
  let errorMessage = "";

  //email-input
  if (inputElm === emailInput) {
    //error cases
    if (emailInput.validity.typeMismatch) {
      errorMessage = "Please enter a valid email address";
    } else if (emailInput.value === "") {
      errorMessage = "Please enter your email";
    }
  }

  //country-input
  if (inputElm === countryInput) {
    //error cases
    if (countryInput.value === "") {
      errorMessage = "Please enter your country of residence";
    }
  }

  //zip-code-input
  //need cases for other countries
  if (inputElm === zipCodeInput) {
    //error cases
    if (zipCodeInput.validity.tooShort) {
      errorMessage = `Please enter ${zipCodeInput.maxLength - zipCodeInput.value.length} more digits`;
    } else if (zipCodeInput.value === "") {
      errorMessage = "Please enter your zip code";
    } else if (zipCodeInput.validity.patternMismatch) {
      errorMessage = "Please enter 5 digit zip code";
    }
  }

  //password-input
  if (inputElm === passwordInput) {
    //error cases
    if (passwordInput.value === "") {
      errorMessage = "Please create a password";
    }
  }

  //confirm-password-input
  if (inputElm === confirmPasswordInput) {
    //error cases
    if (confirmPasswordInput.value === "") {
      errorMessage = "Please confirm your password";
    }
  }

  return errorMessage;
}

function getErrorElm(inputElm) {
  const errorElm = inputElm.parentElement.parentElement.querySelector(
    ".form-field-line-error-message"
  );

  return errorElm;
}

function setErrorMessage(elm, message) {
  elm.textContent = message;
}
