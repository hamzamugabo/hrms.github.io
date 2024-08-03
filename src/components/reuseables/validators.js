const validatePhoneNumber = (number) => {
    const phonePattern = /^\d{10,12}$/; // Adjust the pattern to match 10 to 15 digits
    return phonePattern.test(number);
};

export { validatePhoneNumber };
