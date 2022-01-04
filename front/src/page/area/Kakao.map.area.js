/* global kakao */
import React, { useEffect, useState } from 'react';

const { kakao } = window;

const line = (from, to) => {
    let ret = null;
    if (from.err === 0 && to.err === 0) {
        const path = [
            new kakao.maps.LatLng(from.latitude, from.longitude),
            new kakao.maps.LatLng(to.latitude, to.longitude),
        ];
        ret = new kakao.maps.Polyline({
            path,
            strokeWeight: 3,
            strokeColor: '#db4040',
            strokeOpacity: 1,
            strokeStyle: 'solid',
        });
        return ret;
    }
    return ret;
};

function makeTileList({ center, gap, color }) {
    return new Promise((resolve, reject) => {
        const ret = [];
        let toggle = false;
        for (let i = -10; i <= 10; i++) {
            for (let j = -10; j <= 10; j++) {
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

const KakaoMapArea = () => {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState(null);
    const [bound, setBound] = useState(null);

    //처음 지도 그리기
    useEffect(async () => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.4953, 126.4878),
            level: 4,
        };
        const kakaoMap = new kakao.maps.Map(container, options);
        kakaoMap.setMinLevel(3);
        kakaoMap.setMaxLevel(5);
        const tileData = await makeTileList({
            center: [37.4953, 126.4878],
            gap: 0.002,
            color: ['#F79F81', '#A9A9F5'],
        });
        tileData.forEach((tile) => {
            tile.setMap(kakaoMap);
        });
        setMap(kakaoMap);
    }, []);

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
        </div>
    );
};

export default KakaoMapArea;
