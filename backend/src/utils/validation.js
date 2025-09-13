const validateName = (name) => {
  return name && name.length <= 60;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if(!password) return false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const validLength = password.trim().length >= 8 && password.trim().length <= 16;
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && validLength;
};

const validateAddress = (address) => {
  return !address || address.length <= 400;
};

const validateRating = (rating) => {
  const num = parseInt(rating);
  return num >= 1 && num <= 5;
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRating
};