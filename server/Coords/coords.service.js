const { userRepository, coordsRepository } = require('../repository/index');
const {
    deleteRecord,
    saveCurrentRecord,
    getRecord,
} = require('../redis/coords.redis');

const startRecord = async ({ usercode, username }) => {
    try {
        const userData = await userRepository.findUser({ usercode });
        // 1. 유저 확인
        if (!userData || userData.username !== username) {
            throw new Error('No UserData');
        }
        if (userData.status !== 0) {
            throw new Error('User Status is Not idle');
        }

        // 2. 레코드 만들기
        await coordsRepository.createRecord({ usercode });

        // 3. 번호 받아오기
        const { recordcode } =
            await coordsRepository.getCurrentRecordWithStatus({
                usercode,
                status: 0,
            });
        await userRepository.updateUserStatus({ usercode, status: 1 });
        return {
            success: true,
            recordcode,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

const saveRecord = async ({ usercode, record }) => {
    try {
        //유저 상태 확인해야함.
        await saveCurrentRecord({ usercode, record });
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

const finishRecording = async ({ usercode, recordcode }) => {
    try {
        await userRepository.updateUserStatus({ usercode, status: 2 });
        //1. 레코드 상태 변경
        await coordsRepository.finishRecord({ recordcode, status: 1 });
        //2. redis에서 데이터 가지고오고 redis는 삭제
        const res = await getRecord({ usercode });
        await deleteRecord({ usercode });
        //3. 점 데이터를 선으로 변환
        console.log(res);
        //4. 종료
        await userRepository.updateUserStatus({ usercode, status: 0 });
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

const finishWithError = async ({ usercode, recordcode }) => {
    try {
        //0. 처리시작
        await userRepository.updateUserStatus({ usercode, status: 2 });
        //1. 레코드 상태 변경
        await coordsRepository.finishRecord({ recordcode, status: 2 });
        //2. redis삭제
        await deleteRecord({ usercode });
        //3. 종료   
        await userRepository.updateUserStatus({ usercode, status: 0 });
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

const resetRecord = async ({ usercode }) => {
    try {
        //1. 기록중인거 에러처리
        const { recordcode } =
            await coordsRepository.getCurrentRecordWithStatus({
                usercode,
                status: 0,
            });
        await coordsRepository.finishRecord({
            recordcode,
            status: 2,
        });
        await deleteRecord({ usercode });

        //2. 유저상태 변경
        await userRepository.updateUserStatus({ usercode, status: 0 });
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    startRecord,
    saveRecord,
    finishRecording,
    finishWithError,
    resetRecord,
};
