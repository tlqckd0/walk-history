const {
    makeTile,
    makeLineFunc,
    passCheck,
    makeTileToPosList,
    rangeCheck,
} = require('./area.calc');
const { areaRepository } = require('../repository/index');

const areaProcess = async ({ usercode, coords, recordcode }) => {
    try {
        const length = coords.length;
        const max_coords = { latitude: 0, longitude: 0 };
        const min_coords = { latitude: 90, longitude: 180 };
        // 1. 좌표확인
        for (let i = 0; i < length; i++) {
            //최대값
            max_coords.latitude = Math.max(
                max_coords.latitude,
                coords[i].latitude
            );
            max_coords.longitude = Math.max(
                max_coords.longitude,
                coords[i].longitude
            );
            //최소값
            min_coords.latitude = Math.min(
                min_coords.latitude,
                coords[i].latitude
            );
            min_coords.longitude = Math.min(
                min_coords.longitude,
                coords[i].longitude
            );
        }

        // 2. 좌표 지나가는지 확인
        const mapTile = await makeTile({ max_coords, min_coords });
        coords.push(coords[0]); //마지막이랑 연결해줘야.
        for (let i = 0; i < coords.length - 1; i++) {
            const pos = [
                {
                    x: coords[i].longitude,
                    y: coords[i].latitude,
                },
                {
                    x: coords[i + 1].longitude,
                    y: coords[i + 1].latitude,
                },
            ];
            const func = makeLineFunc({ pos1: pos[0], pos2: pos[1] });
            mapTile.forEach((rowTiles) => {
                rowTiles.forEach((tile) => {
                    if (tile.visited === false) {
                        const posList = makeTileToPosList({ tile });
                        if (rangeCheck({ pos, tile }) === true) {
                            if (passCheck({ posList, func })) {
                                tile.visited = true;
                                tile.time = coords[i].time;
                            }
                        }
                    }
                });
            });
        }

        // 3. count정보 없으면 생성 & 있으면 count+1.
        mapTile.forEach((rowTiles) => {
            rowTiles.forEach(async (tile) => {
                if (tile.visited) {
                    await areaRepository.InsertArea({
                        usercode,
                        latitude: tile.sw.lat,
                        longitude: tile.sw.lon,
                        recordcode,
                        time: tile.time,
                    });
                }
            });
        });
        //정상 종료
        return true;
    } catch (err) {
        throw err;
    }
};

const findAreaDetail = async ({ username, latitude, longitude }) => {
    try {
        if (username !== null) {
            const result = await areaRepository.FindUserAreaDetail({
                username,
                latitude,
                longitude,
            });
            return result;
        } else {
            const result = await areaRepository.FindAreaDetail({
                latitude,
                longitude,
            });
            return result;
        }
    } catch (err) {
        throw err;
    }
};

const findAreaCount = async ({
    username,
    bottom,
    top,
    left,
    right,
    startTime,
    endTime,
}) => {
    try {
        if (username !== null) {
            const result = await areaRepository.FindAreaCountByUserName({
                username,
                bottom,
                top,
                left,
                right,
                startTime,
                endTime,
            });
            return result;
        } else {
            const result = await areaRepository.FindTotalCountArea({
                bottom,
                top,
                left,
                right,
                startTime,
                endTime,
            });
            return result;
        }
    } catch (err) {
        console.log(err.message);
        throw err;
    }
};

module.exports = {
    areaProcess,
    findAreaCount,
    findAreaDetail,
};
