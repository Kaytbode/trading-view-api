const regex = /^[A-Za-z0-9]+$/;
const regexSort = /^[1-4]$/;

const validate = (val)=> regex.test(val);

module.exports = { regex, regexSort, validate }