const Validator = require('validatorjs');
const userValidation = data => {
    const schema = {
        name: 'min:5|required',
        email: 'min:6|required|email',
        password: 'min:6|required'
    };
    return new Validator(data, schema)
}

const loginValidation = data => {
    const schema = {
        name: 'min:6',
        email: 'min:6|required|email',
        password: 'min:6|required'
    }
    return new Validator(data, schema)
}
module.exports.userValidation = userValidation;
module.exports.loginValidation = loginValidation;
