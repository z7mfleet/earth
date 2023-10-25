export const getRandomStr = (length = 10) => {
    let charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += charSet[Math.floor(Math.random() * charSet.length)];
    return result;
}

export const getRandomNumber = (min: number, max: number, options = { isInt: true }) => {
    let isInt = options.isInt;
    let n = min + Math.random() * (max - min);
    return isInt ? Math.floor(n) : n;
}

export const getRandomColorString = () => {
    return `#${Math.floor(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`;
}