/**
 * AREA기능개발 이전에 이동데이터 저장용임 
 */

require('dotenv').config();

const {coordRepository} = require('../repository/index')
const areaService = require('./area.service');

function line_to_coords ({lines}){
    const coords = lines.map(line=>{
        const coord = {
            latitude :line.from_latitude,
            longitude  : line.from_longitude
        }
        return coord
    })
    return coords;
}

async function main({usercode, recordcode}){
    const lines = await coordRepository.findCoordsWithRecordcode({recordcode});
    const coords = line_to_coords({lines});
    await areaService.areaProcess({usercode, coords,recordcode});
}

main({
    usercode:2,
    recordcode:32
});