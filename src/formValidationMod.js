// formValidationMod.js

// ======================================== Declarations ======================================== //
const form1 = document.querySelector("#form-1");

//grab all field inputs
const allFieldInputs = document.querySelectorAll(
  "[data-special-class='form-input-field']"
);
const countryInput = document.querySelector("#country-input");
const zipCodeInput = document.querySelector("#zip-code-input");

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
  //ELs for when the user leaves input focus. For inoffensive UI (delayed negative feedback/checks)
  allFieldInputs.forEach((fieldInput) => {
    fieldInput.addEventListener("blur", () => {
      //Check for/update error
      showErrorMessage(fieldInput);

      //add "touched class"
      addClassToElm(fieldInput, "touched");
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

  //on country input
  countryInput.addEventListener("change", () => {
    //add "touched" class to country input on country selection
    addClassToElm(countryInput, "touched");

    //update zip pattern
    updateZipCodePattern();

    //check zip code error here
    if (zipCodeInput.classList.contains("touched")) {
      showErrorMessage(zipCodeInput);
    }
  });

  // on zip input (for digit counter)
  zipCodeInput.addEventListener("input", () => {
    //only counts if already initiated ("touched")
    if (zipCodeInput.classList.contains("touched")) {
      showErrorMessage(zipCodeInput);
    }
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

//group all field inputs and list out all error cases. Search through databank
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

    // USA/Mexico
    if (countryInput.value === "US" || countryInput.value === "MX") {
      //zip is too short or contains non-numbers

      if (inputElm.validity.patternMismatch) {
        errorMessage = "Please enter five digit zip code";
      }

      if (inputElm.validity.tooShort) {
        //test
        console.log("short/bad");
        errorMessage = `Please enter ${inputElm.maxLength - inputElm.value.length} more digits`;
      }
    }

    // Canada
    if (countryInput.value === "CA") {
      if (inputElm.validity.patternMismatch) {
        errorMessage =
          'Please follow pattern: "ANA NAN" (A = alpha, N = number)';
      }
    }
    //run checks for each
    //  (a = alpha, n = number), <br> no D, F, I, O, Q, or U anywhere and no W and Z for first letter';

    //no input
    if (inputElm.value === "") {
      errorMessage = "Please enter your zip code";
    }

    //no country selected
    if (countryInput.value === "") {
      errorMessage = "Please select country of residence first";
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

function updateZipCodePattern() {
  //possible values: "", CA, MX, US, "other"
  const countrySelection = countryInput.value;

  if (countrySelection === "" || countrySelection === "other") {
    zipCodeInput.setAttribute("pattern", "");
    zipCodeInput.setAttribute("minLength", "");
    zipCodeInput.setAttribute("maxLength", "");
  }
  if (countrySelection === "US" || countrySelection === "MX") {
    zipCodeInput.setAttribute("pattern", "^\\d{5}$");
    zipCodeInput.setAttribute("minLength", "5");
    zipCodeInput.setAttribute("maxLength", "5");
  }
  if (countrySelection === "CA") {
    //pattern is "ANA NAN" (a = alpha, n = number), no D, F, I, O, Q, or U anywhere and no W and Z for first letter
    zipCodeInput.setAttribute(
      "pattern",
      "^[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJKLMNPRSTVWXYZ] \\d[ABCEGHJKLMNPRSTVWXYZ]\\d$"
    );
    zipCodeInput.setAttribute("minLength", "7");
    zipCodeInput.setAttribute("maxLength", "7");
  }
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

function isOnlyNumbers(str) {
  return /^[0-9]+$/.test(str);
}

function addClassToElm(elm, className) {
  elm.classList.add(className);
}
