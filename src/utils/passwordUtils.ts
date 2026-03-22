export const evaluatePasswordStrength = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strength = [hasMinLength, hasNumber, hasSpecial].filter(Boolean).length;

  return {
    hasMinLength,
    hasNumber,
    hasSpecial,
    strength,
  };
};
