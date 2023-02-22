const regex = /^[A-Za-z0-9]+$/;
const regexSort = /^[1-4]$/;
const regexTF = /^[0-9]+[m,h,d,w,M]$/;

const validate = (val)=> regex.test(val);

module.exports = { regex, regexSort, regexTF, validate }