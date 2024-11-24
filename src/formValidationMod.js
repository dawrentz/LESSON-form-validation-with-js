// formValidationMod.js

//declarations
const form1 = document.querySelector("#form-1");

const allFieldInputs = document.querySelectorAll(
  "[data-special-class='form-input-field']"
);

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
  //Check for/update error when leave input focus. For inoffensive UI (delayed negative feedback)
  allFieldInputs.forEach((fieldInput) => {
    fieldInput.addEventListener("blur", () => {
      showErrorMessage(fieldInput);
    });
  });

  //Check for no error on each input. For immediate positive feedback: nice UI
  allFieldInputs.forEach((fieldInput) => {
    fieldInput.addEventListener("input", () => {
      // showErrorMessage(fieldInput);
      if (fieldInput.checkValidity()) {
        removeErrorMessage(fieldInput);
      }
    });
  });
}

// ======================================== Derived/Special Functions ======================================== //

function showErrorMessage(fieldInput) {
  //get errorMessageElm and error message
  const errorElm = getErrorElm(fieldInput);
  const errorMessage = getErrorMessage(fieldInput);
  setErrorMessage(errorElm, errorMessage);
}

//for input-event (checks for only valid on each input)
function removeErrorMessage(inputEventElm) {
  const errorElm = getErrorElm(inputEventElm);
  setErrorMessage(errorElm, "");
}

//group all field inputs and list out all error cases. Like an accessable databank
function getErrorMessage(inputElm) {
  let errorMessage;

  //email-input
  if (inputElm.id === "email-input") {
    //error cases
    if (inputElm.validity.typeMismatch) {
      errorMessage = "Please enter a valid email address";
    } else if (inputElm.value === "") {
      errorMessage = "Please enter your email";
    }
  }

  //country-input
  if (inputElm.id === "country-input") {
    //error cases
    if (inputElm.value === "") {
      errorMessage = "Please enter your country of residence";
    }
  }

  //zip-code-input
  //need cases for other countries
  if (inputElm.id === "zip-code-input") {
    //error cases
    if (inputElm.validity.tooShort) {
      errorMessage = `Please enter ${inputElm.maxLength - inputElm.value.length} more digits`;
    } else if (inputElm.value === "") {
      errorMessage = "Please enter your zip code";
    } else if (inputElm.validity.patternMismatch) {
      errorMessage = "Please enter 5 digit zip code";
    }
  }

  //password-input
  if (inputElm.id === "password-input") {
    //error cases
    if (inputElm.value === "") {
      errorMessage = "Please create a password";
    }
  }

  //confirm-password-input
  if (inputElm.id === "confirm-password-input") {
    //error cases
    if (inputElm.value === "") {
      errorMessage = "Please confirm your password";
    }
  }

  return errorMessage;
}

// ======================================== Generic Functions ======================================== //

function getErrorElm(inputElm) {
  const errorElm = inputElm.parentElement.parentElement.querySelector(
    ".form-field-line-error-message"
  );

  return errorElm;
}

function setErrorMessage(elm, message) {
  elm.textContent = message;
}
