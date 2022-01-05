/* global kakao */
import React, { useEffect, useState } from 'react';
import CButton from '../../component/CButton';

const { kakao } = window;

function makeTileList({ center, gap, color, size }) {

    return new Promise((resolve, reject) => {
        const ret = [];
        let toggle = false;
        for (let i = -size; i <= size; i++) {
            for (let j = -size; j <= size; j++) {
                const sw = new kakao.maps.LatLng(
                    center[0] + i * gap,
                    center[1] + j * gap
                );
                const ne = new kakao.maps.LatLng(
                    center[0] + (i + 1) * gap,
                    center[1] + (j + 1) * gap
                );
                const rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);
                const rect = new kakao.maps.Rectangle({
                    bounds: rectangleBounds, // 그려질 사각형의 영역정보입니다
                    strokeWeight: 1, // 선의 두께입니다
                    strokeColor: '#000000', // 선의 색깔입니다
                    strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'dashed', // 선의 스타일입니다
                    fillColor: toggle ? color[0] : color[1], // 채우기 색깔입니다
                    fillOpacity: 0.5, // 채우기 불투명도 입니다
                });
                toggle = !toggle;
                ret.push(rect);
            }
        }
        resolve(ret);
    })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err.message);
            return [];
        });
}
function getBoundInfo({ bound }) {
    const ret = {
        sw_lat: bound.getSouthWest().La.toFixed(4),
        sw_lon: bound.getSouthWest().Ma.toFixed(4),
        ne_lat: bound.getNorthEast().La.toFixed(4),
        ne_lon: bound.getNorthEast().Ma.toFixed(4),
    };

    return ret;
}

const KakaoMapArea = ({getDataButtonHandler}) => {
    const [map, setMap] = useState(null);
    const [bound, setBound] = useState(null);
    const [tiles, setTiles] = useState([]);
    //처음 지도 그리기
    useEffect(async () => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.4953, 126.4878),
            level: 4,
        };
        const kakaoMap = new kakao.maps.Map(container, options);
        kakao.maps.event.addListener(kakaoMap, 'dragend', () => {
            const bound = kakaoMap.getBounds();
            setBound(getBoundInfo({ bound }));
        });

        const initBound = kakaoMap.getBounds();
        setBound(getBoundInfo({ bound: initBound }));
        setMap(kakaoMap);
    }, []);



    const deleteTileHandler = (e)=>{
        e.preventDefault();
        tiles.forEach((tile) => {
            tile.setMap(null);
            tile = null;
        });
        setTiles([]);
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'inline-block',
                marginLeft: '5px',
                marginRight: '5px',
            }}
        >
            <div id="map" style={{ width: '99%', height: '700px' }}></div>
            <button
             style={{ width: '150px', height: '50px', margin: '10px' }}
             onClick={(e)=>{
                getDataButtonHandler(e,bound);
             }}
             >
                 데이터 가져오기

            </button>

            <CButton
                disableStatus={false}
                value={'지우기'}
                type={-1}
                onClickHandler={deleteTileHandler}
            />            
        </div>
    );
};

export default KakaoMapArea;


// const getDataButtonHandler = async (e) => {
//     tiles.forEach((tile) => {
//         tile.setMap(null);
//         tile = null;
//     });
//     e.preventDefault();
//     console.log(bound);
//     const newTiles = await makeTileList({
//         center: [
//             map.getCenter().getLat(),
//             map.getCenter().getLng(),
//         ],
//         gap: 0.0015,
//         color: ['#178FAA', '#D47FF1'],
//         size: 5,
//     });
//     newTiles.forEach((tile) => {
//         tile.setMap(map);
//     });
//     setTiles(newTiles);
// };