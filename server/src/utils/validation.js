/**
 * Utility functions for form validations
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return false;
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUppercase && hasSpecial;
};

export const validateName = (name) => {
  return name && name.length >= 3 && name.length <= 60;
};

export const validateAddress = (address) => {
  return !address || address.length <= 400;
};
