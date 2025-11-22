function preFillLoginForm() {
  const emailInput = document.getElementById('login-email-input');
  const passwordInput = document.getElementById('login-password-input');
  emailInput.value = "sofiam@gmail.com";
  passwordInput.value = "mypassword123";
}

// preFillLoginForm();