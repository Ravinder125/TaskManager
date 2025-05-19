const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const addThousandsSeprator = (num) => {
    if (num == null || isNaN(num)) return '';

    const [integerPart, fractionalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger

};

const formatName = (name) => {
    if (!name || !name.firstName || !name.lastName) return '';
    const firstName =
        name.firstName.charAt(0).toUpperCase() +
        name.firstName.slice(1);
    return `${firstName} ${name.lastName}`;
}

export {
    validateEmail,
    addThousandsSeprator,
    formatName
} 
