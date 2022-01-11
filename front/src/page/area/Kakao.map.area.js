/* global kakao */
import React, { useEffect, useState } from 'react';
import CButton from '../../component/CButton';

const { kakao } = window;
const gap = 0.001;

function colorLevel({ count, countMax }) {
    
    let base = '#FF3333'; //MAX일때 '#FF0000'
    return base;
    const value = 1 - count / countMax;
    const R = 'FF';
    let G = (parseInt('AA', 16) * value).toString(16);
    let B = (parseInt('AA', 16) * value).toString(16);
    if (G.length === 1) {
        G = '0' + G;
    }
    if (B.length === 1) {
        B = '0' + B;
    }
    return `#${R}${G}${B}`;
}
function makeTileList({ areaData }) {
    return new Promise((resolve, reject) => {
        //이부분은 나중에 메타데이터 가지고 오는 방향으로 변경하자.
        let countMax = -1;
        areaData.forEach((tile) => {
            countMax = Math.max(countMax, tile.count*1);
        });
        const ret = [];

        areaData.forEach((tile) => {
            const sw = new kakao.maps.LatLng(tile.latitude, tile.longitude);
            const ne = new kakao.maps.LatLng(
                tile.latitude + gap,
                tile.longitude + gap
            );
            const rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);
            const rect = new kakao.maps.Rectangle({
                bounds: rectangleBounds,
                strokeWeight: 1, 
                strokeColor: '#000000', 
                strokeOpacity: 0, 
                strokeStyle: 'dashed', 
                fillColor: colorLevel({ count: tile.count*1, countMax }), 
                fillOpacity: 0.5,
            });
            ret.push(rect);
        });
        resolve(ret);
    })
        .then((tiles) => {
            return tiles;
        })
        .catch((err) => {
            console.log(err.message);
            return [];
        });
}

function getBoundInfo({ bound }) {
    const ret = {
        sw_lat: bound.getSouthWest().Ma,
        sw_lon: bound.getSouthWest().La,
        ne_lat: bound.getNorthEast().Ma,
        ne_lon: bound.getNorthEast().La,
    };

    return ret;
}

const KakaoMapArea = ({ getDataButtonHandler, areaData }) => {
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
        kakaoMap.setMaxLevel(5);

        const initBound = kakaoMap.getBounds();
        setBound(getBoundInfo({ bound: initBound }));
        setMap(kakaoMap);
    }, []);

    const deleteTile = () => {
        return new Promise((resolve, reject) => {
            tiles.forEach((tile) => {
                tile.setMap(null);
                tile = null;
            });
            setTiles([]);
            resolve(true);
        });
    };
    useEffect(async () => {
        await deleteTile();
        const newTiles = await makeTileList({ areaData });
        newTiles.forEach((tile) => {
            tile.setMap(map);
        });
        setTiles(newTiles);
    }, [areaData]);

    const deleteTileHandler = async (e) => {
        e.preventDefault();
        await deleteTile();
    };

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
                onClick={(e) => {
                    getDataButtonHandler(e, bound);
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

