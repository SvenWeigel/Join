function preFillLoginForm() {
  const emailInput = document.getElementById('login-email-input');
  const passwordInput = document.getElementById('login-password-input');
  emailInput.value = "sofiam@gmail.com";
  passwordInput.value = "mypassword123";
}

// preFillLoginForm();


//Signup.html - Checkbox muss markiert sein um Sign up Button betätigen zu können
function enableSignupOnCheck(){
  const privacyCheck = document.getElementById('check-privacy');
  const signupBtn = document.getElementById('signup-btn');

  privacyCheck.addEventListener('change', () => {
      signupBtn.disabled = !privacyCheck.checked;
  });
}