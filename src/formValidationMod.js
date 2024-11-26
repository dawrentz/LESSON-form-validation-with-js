// formValidationMod.js

// ======================================== Declarations ======================================== //
const form1 = document.querySelector("#form-1");

//grab all field inputs
const allFieldInputs = document.querySelectorAll(
  "[data-special-class='form-input-field']"
);
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
{
} //spacer

function addELtoFromSubmit() {
  form1.addEventListener("submit", (event) => {
    if (form1.checkValidity()) {
      console.log("high five");
      form1.reset();

      allFieldInputs.forEach((fieldInput) => {
        removeClassFromElm(fieldInput, "touched");
      });
    } else {
      // showFormInputError(event);

      console.log("error in form");
      allFieldInputs.forEach((fieldInput) => {
        showErrorMessage(fieldInput);
        addClassToElm(fieldInput, "touched");
      });
    }

    //novalidate is turned on in html
    //prevent all  form submissions to avoid page refresh
    event.preventDefault();
  });
}

//these should probably all be individual checkerFunctions, but ain't nobody got time for that
function addELsToFormInputs() {
  //on any input blur. For inoffensive UI (delayed negative feedback/checks)
  allFieldInputs.forEach((fieldInput) => {
    fieldInput.addEventListener("blur", () => {
      //Check for/update error
      showErrorMessage(fieldInput);

      //add "touched class"
      addClassToElm(fieldInput, "touched");
    });
  });

  //on any input input. For immediate positive feedback: nice UI
  allFieldInputs.forEach((fieldInput) => {
    fieldInput.addEventListener("input", () => {
      //Check for no error on each input (if already touched)
      if (fieldInput.classList.contains("touched")) {
        showErrorMessage(fieldInput);
      }
      //on all other inputs, just erase error-message on valid-input
      else if (fieldInput.checkValidity()) {
        removeErrorMessage(fieldInput);
      }
    });
  });

  //on country input
  countryInput.addEventListener("change", () => {
    //update zip pattern
    updateZipCodePattern();
    //works a little differnt that the <input>'s
    showErrorMessage(countryInput);

    if (countryInput.value !== "") {
      removeClassFromElm(zipCodeInput, "no-country-input");
    } else {
      addClassToElm(zipCodeInput, "no-country-input");
    }

    //check zip code error here
    if (zipCodeInput.classList.contains("touched")) {
      showErrorMessage(zipCodeInput);
    }
  });

  // on zip input (for digit counter)
  zipCodeInput.addEventListener("input", () => {
    //only counts if already initiated (that is, "touched")
    if (zipCodeInput.classList.contains("touched")) {
      showErrorMessage(zipCodeInput);
    }
  });

  //on password touch
  passwordInput.addEventListener("blur", () => {
    if (passwordInput.checkValidity()) {
      updateConfirmPasswordPattern();
    }
  });

  //on password input
  passwordInput.addEventListener("input", () => {
    if (passwordInput.checkValidity()) {
      removeClassFromElm(confirmPasswordInput, "no-set-password");
    } else {
      addClassToElm(confirmPasswordInput, "no-set-password");
    }

    if (passwordInput.value === confirmPasswordInput.value) {
      removeClassFromElm(confirmPasswordInput, "no-match-password");
    } else {
      addClassToElm(confirmPasswordInput, "no-match-password");
    }

    //confirmpass touched run errorcheck
    if (confirmPasswordInput.classList.contains("touched")) {
      showErrorMessage(confirmPasswordInput);
    }
  });

  //on confirm password input
  confirmPasswordInput.addEventListener("input", () => {
    //DRY, oops. really should make all these cases into checkerFunctions
    if (passwordInput.value === confirmPasswordInput.value) {
      removeClassFromElm(confirmPasswordInput, "no-match-password");
    } else {
      addClassToElm(confirmPasswordInput, "no-match-password");
    }
  });
}

// ======================================== Derived/Special Functions ======================================== //
{
} //spacer

//does not erase error messages
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
      if (inputElm.validity.tooShort) {
        const numDigitsNeeded = inputElm.maxLength - inputElm.value.length;
        let sCharacter = numDigitsNeeded > 1 ? "s" : "";

        errorMessage = `Please enter ${numDigitsNeeded} more digit${sCharacter}`;
      }

      if (!isOnlyNumbers(inputElm.value)) {
        errorMessage = "Please enter digits only";
      }
    }

    // Canada
    if (countryInput.value === "CA") {
      if (inputElm.validity.patternMismatch) {
        errorMessage =
          'Please follow pattern: "ANA NAN" (A = alpha, N = number)';
      }
      if (/[DFIOQU]/.test(inputElm.value)) {
        errorMessage = "Please do not use D, F, I, O, Q, or U";
      }
      if (/^[WZ]/.test(inputElm.value)) {
        errorMessage = "Please do not use W or Z for the first letter";
      }
      if (/[a-z]/.test(inputElm.value)) {
        errorMessage = "No lowercase letters please";
      }
    }

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
    if (inputElm.validity.patternMismatch || inputElm.validity.tooShort) {
      errorMessage = "Please fulfill password requirements";
    }
  }

  //confirm-password-input
  if (inputElm.id === "confirm-password-input") {
    //error cases
    if (passwordInput.value !== inputElm.value) {
      errorMessage = "Passwords do no match; please confirm";
    }
    if (!passwordInput.checkValidity()) {
      errorMessage = "Please create valid password first";
    }
  }

  return errorMessage;
}

function updateZipCodePattern() {
  //possible values: "", CA, MX, US, "other"
  const countrySelection = countryInput.value;

  if (countrySelection === "" || countrySelection === "other") {
    zipCodeInput.removeAttribute("pattern");
    zipCodeInput.removeAttribute("minLength");
    zipCodeInput.removeAttribute("maxLength");
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

function updateConfirmPasswordPattern() {
  confirmPasswordInput.setAttribute("pattern", passwordInput.value);
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

function addClassToElm(elm, className) {
  elm.classList.add(className);
}

function removeClassFromElm(elm, className) {
  elm.classList.remove(className);
}

function isOnlyNumbers(str) {
  return /^[0-9]+$/.test(str);
}
