const {userRepository} = require('../repository/index');

const getUserInfo = async({usercode, username})=>{
    try{
        const userData = await userRepository.findUser({usercode});
        if (!userData || userData.username !== username) {
            throw new Error('No UserData');
        }

        return userData;
    }catch(err){
        throw new Error(err.message);
    }
}

module.exports = {
    getUserInfo
}