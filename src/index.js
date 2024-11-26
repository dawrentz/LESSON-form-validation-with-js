//index.js

//imports
import "./style.css";
import * as formValidationMod from "./formValidationMod.js";

// ====================================== Init ====================================== //

//init formValidation
formValidationMod.initFormValidation();

const password = "sS2!";

// Test for at least one lowercase letter using a positive lookahead
if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  console.log("pass test");
} else {
  console.log("failed test");
}
