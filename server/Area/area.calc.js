const gap = 0.001;

//타일만들기
async function makeTile ({max_coords, min_coords}){
    //4군대 만들어서
    const tileBound = {top : null, bottom : null, left : null, right : null};
    tileBound.top = Math.ceil(max_coords.latitude * 1000) / 1000;
    tileBound.bottom = Math.floor(min_coords.latitude * 1000) / 1000;
    tileBound.right = Math.ceil(max_coords.longitude * 1000) / 1000;
    tileBound.left = Math.floor(min_coords.longitude * 1000) / 1000;
    const tiles = [];
    for(let i=tileBound.bottom ; i < tileBound.top; i += gap){
        const temp = [];
        for(let j=tileBound.left ; j < tileBound.right; j += gap){
            temp.push({
                visited : false,
                sw: {
                    lat: i.toFixed(3) * 1,
                    lon: j.toFixed(3) * 1,
                },
                ne: {
                    lat: (i + gap).toFixed(3) * 1,
                    lon: (j + gap).toFixed(3) * 1,
                },
            });
        }
        tiles.push(temp);
    }
    console.log(tileBound);
    return tiles;
}

//직선 함수 만들기
function makeLineFunc({ pos1, pos2 }) {
    //같은 점은 들어올 수 없다.

    if (pos1.x === pos2.x) {
        //x좌표가 같은 경우(위도) // Y축 평행
        return {
            a: pos1.x,
            b: 'F',
        };
    }

    if (pos1.y === pos2.y) {
        //y좌표가 같은 경우(경도) // X축 평행
        return {
            a: 'F',
            b: pos1.y,
        };
    }

    let a = (pos1.y - pos2.y) / (pos1.x - pos2.x);
    let b = pos1.y - a * pos1.x;

    return { a, b };
}

//직선(선분X)이 이 지역을 지나가는지 확인(사각형의 4꼭지점 기준)
function passCheck({ posList, func }) {
    if (func.a === 'F') {
        //직선이 X축 평행
        const stand = func.b > posList[0].y;
        for (let i = 1; i <= 3; i++) {
            if (func.b > posList[i].y !== stand) {
                return true;
            }
        }
    } else if (func.b === 'F') {
        //직선이 Y축이랑 평행
        const stand = func.a > posList[0].x;
        for (let i = 1; i <= 3; i++) {
            if (func.a > posList[i].x !== stand) {
                return true;
            }
        }
    } else {
        const stand = func.a * posList[0].x + func.b - posList[0].y > 0;
        for (let i = 1; i <= 3; i++) {
            if (func.a * posList[i].x + func.b - posList[i].y > 0 !== stand) {
                return true;
            }
        }
    }
    return false;
}

//tile을 tileList변환
function makeTileToPosList({ tile }) {
    const tileList = new Array(4);
    tileList[0] = { x: null, y: null };
    tileList[1] = { x: null, y: null };
    tileList[2] = { x: null, y: null };
    tileList[3] = { x: null, y: null };

    tileList[0].x = tile.sw.lon;
    tileList[0].y = tile.sw.lat;

    tileList[1].x = tile.sw.lon;
    tileList[1].y = tile.ne.lat;

    tileList[2].x = tile.ne.lon;
    tileList[2].y = tile.sw.lat;

    tileList[3].x = tile.ne.lon;
    tileList[3].y = tile.ne.lat;

    return tileList;
}

//해당 선분이(직선X) tile을 지나가는지.
function rangeCheck({pos,tile}){
    if (pos[0].y < pos[1].y) {
        if (pos[0].x < pos[1].x) {
            //x,y둘다 증가.
            if (
                pos[0].y < tile.ne.lat &&
                pos[1].y > tile.sw.lat &&
                pos[0].x < tile.ne.lon &&
                pos[1].x > tile.sw.lon
            ) {
                return true;
            }
        } else {
            if (
                pos[0].y < tile.ne.lat &&
                pos[1].y > tile.sw.lat &&
                pos[1].x < tile.ne.lon &&
                pos[0].x > tile.sw.lon
            ) {
                return true;
            }
        }
    } else {
        if (pos[0].x < pos[1].x) {
            if (
                pos[1].y < tile.ne.lat &&
                pos[0].y > tile.sw.lat &&
                pos[0].x < tile.ne.lon &&
                pos[1].x > tile.sw.lon
            ) {
                return true;
            }
        } else {
            if (
                pos[1].y < tile.ne.lat &&
                pos[0].y > tile.sw.lat &&
                pos[1].x < tile.ne.lon &&
                pos[0].x > tile.sw.lon
            ) {
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    makeTile,
    makeLineFunc,
    passCheck,
    makeTileToPosList,
    rangeCheck
}