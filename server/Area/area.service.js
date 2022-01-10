const {
    makeTile,
    makeLineFunc,
    passCheck,
    makeTileToPosList,
} = require('./area.calc');
const { areaRepository } = require('../repository/index');

const areaProcess = async ({ usercode, coords }) => {
    try {
        const length = coords.length;
        const avg_coords = { latitude: 0, longitude: 0 };
        const max_coords = { latitude: 0, longitude: 0 };
        const min_coords = { latitude: 90, longitude: 180 };
        // 1. 좌표확인
        for (let i = 0; i < length; i++) {
            //평균
            avg_coords.latitude += coords[i].latitude;
            avg_coords.longitude += coords[i].longitude;
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
        avg_coords.latitude /= length;
        avg_coords.longitude /= length;

        // 2. 좌표 지나가는지 확인
        const mapTile = await makeTile({ max_coords, min_coords });
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
                    const posList = makeTileToPosList({ tile });
                    if (pos[0].y < tile.ne.lat && pos[1].y > tile.sw.lat) {
                        if (passCheck({ posList, func })) {
                            tile.visited = true;
                        }
                    }
                });
            });
        }

        // 3. count정보 없으면 생성 & 있으면 count+1.
        mapTile.forEach((rowTiles) => {
            rowTiles.forEach(async (tile) => {
                if (tile.visited) {
                    await areaRepository.FindAndInsertArea({
                        usercode,
                        latitude: tile.sw.lat,
                        longitude: tile.sw.lon,
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


const findArea = async({ username, bottom, top, left, right}) =>{
    try{
        if(username !== null){
            const result = await areaRepository.FindAreaByUsername({username, bottom, top, left, right});
            return result;
        }else{
            const result = await areaRepository.FindTotalArea({bottom, top, left, right});
            return result;
        }
    }catch(err){
        console.log(err.message);
        throw err;
    }

}


module.exports = {
    areaProcess,
    findArea
};
