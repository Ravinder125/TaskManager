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
    if (typeof name === 'object') {
        if (!name || !name.firstName || !name.lastName) return '';
        const firstName =
            name.firstName.charAt(0).toUpperCase() +
            name.firstName.slice(1);
        return `${firstName} ${name.lastName}`;
    } else if (typeof name === 'string') {

        if (name.length === 0) return '';
        const firstChar = name.charAt(0);
        if (firstChar === firstChar.toUpperCase()) {
            return `${firstChar.toLowerCase()}${name.slice(1)}`

        } else {
            return `${firstChar.toUpperCase()}${name.slice(1)}`

        }
    }
}

export {
    validateEmail,
    addThousandsSeprator,
    formatName
} 
