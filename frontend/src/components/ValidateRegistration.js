const validator = require("validator");

const validateSignUpForm = payload => {
  const errors = {};
  let message = "";
  let isFormValid = true;

  let nameCheck = /^[a-zA-Z]+$/
  

    //   First name 
  if (
    !payload ||
    typeof payload.fname !== "string" ||
    payload.fname.trim().length === 0 ||
    (payload.fname.trim().length > 0 && payload.fname.trim().length < 3) ||
    !nameCheck.test(payload.fname)
  ) {
    if (!nameCheck.test(payload.fname)) {
      isFormValid = false;
      errors.fname = "Invalid characters.";
    }
    if (payload.fname.trim().length === 0) {
      isFormValid = false;
      errors.fname = "Please provide a first name.";
    }
    if (payload.fname.trim().length > 0 && payload.fname.trim().length < 3) {
      isFormValid = false;
      errors.fname = "First name must contain at least 3 characters.";
    }
  }

  //   Last name 
  if (
    !payload ||
    typeof payload.lname !== "string" ||
    payload.lname.trim().length === 0 ||
    (payload.lname.trim().length > 0 && payload.lname.trim().length < 3) ||
    !nameCheck.test(payload.lname)
  ) {
    if (!nameCheck.test(payload.lname)) {
      isFormValid = false;
      errors.lname = "Invalid characters.";
    }
    if (payload.lname.trim().length === 0) {
      isFormValid = false;
      errors.lname = "Please provide a first name.";
    }
    if (payload.lname.trim().length > 0 && payload.lname.trim().length < 3) {
      isFormValid = false;
      errors.lname = "First name must contain at least 3 characters.";
    }
  }

    //   Email
  if (
    !payload ||
    typeof payload.email !== "string" ||
    !validator.isEmail(payload.email)
  ) {
    isFormValid = false;
    errors.email = "Please provide a correct email address.";
  }

    //   Password
  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 8
  ) {
    isFormValid = false;
    errors.password = "Password must contain at least 8 characters.";
  }

    //   Confirm Password
  if (!payload || payload.confirmed_password !== payload.password) {
    isFormValid = false;
    errors.confirmed_password = "Password confirmation doesn't match.";
  }

    //   Validity check
  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
};

module.exports = {
  validateSignUpForm: validateSignUpForm
};
