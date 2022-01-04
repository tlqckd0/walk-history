const { userRepository, recordRepository } = require('../repository/index');
const coordsService = require('../Coord/coord.service');
const areaService = require('../Area/area.service');
const {
    deleteRecord,
    saveCurrentRecord,
    getRecord,
} = require('../redis/coords.redis');

function coordStringToJson({ coords }) {
    return new Promise((resolve, reject) => {
        const json_coords = coords.map((value) => JSON.parse(value));
        resolve(json_coords);
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
}

const startRecord = async ({ usercode }) => {
    try {
        const userData = await userRepository.findUser({ usercode });
        // 1. 유저 확인
        if (userData.status !== 0) {
            throw new Error('User Status is Not idle');
        }

        // 2. 레코드 만들기
        await recordRepository.createRecord({ usercode });

        // 3. 번호 받아오기
        const { recordcode } = await recordRepository.findCurrentRecordByStatus(
            {
                usercode,
                status: 0,
            }
        );
        await userRepository.updateUserStatus({ usercode, status: 1 });
        return {
            success: true,
            recordcode,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

const findUserRecordList = async ({ username }) => {
    try {
        const recordList = await recordRepository.findRecordByUserName({
            username,
        });
        return recordList;
    } catch (err) {
        throw err;
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
        //1. 처리 시작
        await userRepository.updateUserStatus({ usercode, status: 2 });

        //2. redis에서 데이터 가지고오고 redis는 삭제
        const coords = await getRecord({ usercode });
        await deleteRecord({ usercode });
        const json_coords = await coordStringToJson({ coords });

        //3-1. 점 데이터를 선으로 변환해서 저장.
        await coordsService.saveCoordsToLine({
            recordcode,
            coords: json_coords,
        });

        //3-2. 기록한 데이터 영역 계산
        await areaService.areaProcess({ coords: json_coords });

        //4. 종료 상태 변경 (기록성공)
        await recordRepository.finishRecord({ recordcode, status: 1 });
        await userRepository.updateUserStatus({ usercode, status: 0 });
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

const finishWithError = async ({ usercode, recordcode }) => {
    try {
        //1. 처리시작
        await userRepository.updateUserStatus({ usercode, status: 2 });
        //2. redis삭제
        await deleteRecord({ usercode });
        //3. 종료 상태 변경(기록실패)
        await recordRepository.finishRecord({ recordcode, status: 2 });
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
            await recordRepository.getCurrentRecordWithStatus({
                usercode,
                status: 0,
            });
        await recordRepository.finishRecord({
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
    findUserRecordList,
    saveRecord,
    finishRecording,
    finishWithError,
    resetRecord,
};
