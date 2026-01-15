const bcrypt = require('bcryptjs');

const helpers = {}

helpers.encryptPassword = async (password_Dueño) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password_Dueño, salt);
    return hash;
}
helpers.matchPassword = async (password_Dueño, savedPassword) => {
    try {
        return await bcrypt.compare(password_Dueño, savedPassword);
    } catch (e) {
        console.log(e)
    }
};
module.exports = helpers;