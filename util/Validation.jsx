export function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

  if(email.trim() === "") {
    return "Email is required";
  }

  if(!regex.test(email)) {
    return "Invalid Email";
  }

  return null;
}

export function validatePassword(password) {
  // Check if password is at least 8 characters long
  if(password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  // Check if password contains at least one number
  if(!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  // Check if password contains at least one character
  if(!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one character.";
  }

  // Check if password contains at least one symbol
  if(!/[!@#$%^&*(){}[\]\-_=+\\|;:'",.<>/?`~]/.test(password)) {
    return "Password must contain at least one symbol.";
  }

  return null;
}

export function validateName(name) {
  if(name.trim() === "") {
    return "Name is required";
  }

  if(name.length < 2) {
    return "Name must be at least 2 characters.";
  }
  
  if(!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
    return "Invalid Name";
  }

  return null;
}