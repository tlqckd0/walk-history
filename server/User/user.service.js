const { userRepository } = require('../repository/index');

const findAllUserName = async () => {
    try {
        const userNameList = await userRepository.findAllUser();
        return userNameList;
    } catch (err) {
        throw err;
    }
};

const getUserInfo = async ({ usercode, username }) => {
    try {
        const userData = await userRepository.findUser({ usercode });
        if (!userData || userData.username !== username) {
            throw new Error('No UserData');
        }

        return userData;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    findAllUserName,
    getUserInfo,
};
