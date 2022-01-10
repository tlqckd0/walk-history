const { coordRepository } = require('../repository/index');

const findCoordList = async({recordcode})=>{
    try{
        const coordsList = await coordRepository.findCoordsWithRecordcode({recordcode});
        return coordsList;
    }catch(err){
        throw err;
    }
}

const saveCoordsToLine = async ({ recordcode, coords }) => {
    try {
        const lineSize = coords.length;
        for (let i = 0; i < lineSize - 1; i++) {
            await coordRepository.createCoord({
                recordcode,
                counter: coords[i].counter,
                from_record: coords[i],
                to_record: coords[i + 1],
                time: coords[i].time,
            });
        }
        //마지막이랑 시작점 연결
        await coordRepository.createCoord({
            recordcode,
            counter: coords[lineSize - 1].counter,
            from_record: coords[lineSize - 1],
            to_record: coords[0],
            time: coords[lineSize - 1].time,
        });
    } catch (err) {
        throw err;
    }
};

module.exports = {
    findCoordList,
    saveCoordsToLine,
};
