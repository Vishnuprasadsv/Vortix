export const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);

  const hasNumber = /[0-9]/.test(password);

  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const minLength = password.length >= 6;

  const errors = [];

  if (!minLength) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!hasNumber) {
    errors.push("Password must contain at least one number");
  }

  if (!hasSymbol) {
    errors.push(
      "Password must contain at least one symbol (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?)"
    );
  }

  return {
    isValid: minLength && hasUpperCase && hasNumber && hasSymbol,
    errors,
  };
};
