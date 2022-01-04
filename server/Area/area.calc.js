
const gap = 0.002;

const findWhichArea = async ({ areaList, avg_coords }) => {
    return new Promise((resolve, reject) => {
        const foundArea = {
            code: -1,
            data : null,
        };

        areaList.forEach((area) => {
            const lat_range = [
                area.latitude - gap * area.size,
                area.latitude + gap * area.size,
            ];
            const lon_range = [
                area.longitude - gap * area.size,
                area.longitude + gap * area.size,
            ];

            if (
                lat_range[0] < avg_coords.latitude &&
                avg_coords.latitude < lat_range[1] &&
                lon_range[0] < avg_coords.longitude &&
                avg_coords.longitude < lon_range[1]
            ) {
                foundArea.code = area.areacode;
                foundArea.data = area;
                break;
            }
        });

        resolve(foundArea);
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
}

const countRecordToArea =async ({})=>{
    
}

module.exports = {
    findWhichArea,
    countRecordToArea
}