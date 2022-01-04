const { areaRepository } = require('../repository/index');
const {findWhichArea,countRecordToArea} = require('./area.calc');

const areaProcess = async ({ coords }) => {
    try {
        const length = coords.length;
        const avg_coords = { latitude: 0, longitude: 0 };

        // 1. 좌표의 평균지점을 찾고
        for (let i = 0; i < length; i++) {
            avg_coords.latitude += coords[i].latitude;
            avg_coords.longitude += coords[i].longitude;
        }
        avg_coords.latitude /= length;
        avg_coords.longitude /= length;

        // 2. 어느 지역에 포함되는지 확인한다.
        const areaList = await areaRepository.findAllArea();
        const foundArea = await findWhichArea({ areaList, avg_coords });

        // 2-1. 포함되는곳이 없으면 지역 생성
        if (foundArea.code === -1) {
            const newAreaCode = areaList[areaList.length-1].areacode+1;
            foundArea.areacode = newAreaCode;

            await areaRepository.createArea({
                newAreaCode,
                center_coords: avg_coords,
                size: 10,
            });
        }

        // 3. Count한다.


        // 3-1. Count정보가 없으면 생성

        //종료
    } catch (err) {
        throw err;
    }
};

module.exports = {
    areaProcess,
};
