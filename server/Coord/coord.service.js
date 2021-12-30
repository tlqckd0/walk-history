const { coordRepository } = require('../repository/index');

const CoordStringToJson = ({ coords }) => {
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
};

const saveCoordsToLine = async ({ recordcode, coords }) => {
    try {
        const lineSize = coords.length;
        const json_coords = await CoordStringToJson({ coords });
        for (let i = 0; i < lineSize - 1; i++) {
            await coordRepository.createCoord({
                recordcode,
                counter: json_coords[i].counter,
                from_record: json_coords[i],
                to_record: json_coords[i + 1],
            });
        }
        //마지막이랑 시작점 연결
        await coordRepository.createCoord({
            recordcode,
            counter: 0,
            from_record: json_coords[lineSize - 1],
            to_record: json_coords[0],
        });
    } catch (err) {
        throw err;
    }
};

module.exports = {
    saveCoordsToLine,
};
