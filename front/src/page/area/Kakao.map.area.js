/* global kakao */
import React, { useEffect, useState } from 'react';
import CButton from '../../component/CButton';
import './Kakao.map.area.css';
const { kakao } = window;
const gap = 0.001;

function colorLevel({ count, countMax }) {
    // let base = '#FF3333'; //MAX일때 '#FF0000'
    // return base;
    const value = (countMax - count) / countMax;
    const R = 'FF';
    let G = (parseInt('99', 16) * value).toString(16).substring(0, 2);
    let B = (parseInt('99', 16) * value).toString(16).substring(0, 2);
    if (G.length === 1) {
        G = '0' + G;
    }
    if (B.length === 1) {
        B = '0' + B;
    }
    return `#${R}${G}${B}`;
}
function makeTileList({ areaCount, map, getAreaDetailHandler }) {
    return new Promise((resolve, reject) => {
        //이부분은 나중에 메타데이터 가지고 오는 방향으로 변경하자.
        let countMax = -1;
        areaCount.forEach((tile) => {
            countMax = Math.max(countMax, tile.count * 1);
        });
        const ret = [];
        const customOverlay = new kakao.maps.CustomOverlay({});
        areaCount.forEach((tile) => {
            const sw = new kakao.maps.LatLng(tile.latitude, tile.longitude);
            const ne = new kakao.maps.LatLng(
                tile.latitude + gap,
                tile.longitude + gap
            );
            const rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);
            const rect = new kakao.maps.Rectangle({
                bounds: rectangleBounds,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: colorLevel({ count: tile.count * 1, countMax }),
                fillOpacity: 0.5,
            });

            kakao.maps.event.addListener(rect, 'mouseover', (e) => {
                customOverlay.setContent(
                    '<div class="area">' + tile.count + '</div>'
                );
                customOverlay.setPosition(e.latLng);
                customOverlay.setMap(map);
            });
            kakao.maps.event.addListener(rect, 'mousemove', (e) => {
                customOverlay.setPosition(e.latLng);
            });
            kakao.maps.event.addListener(rect, 'mouseout', (e) => {
                customOverlay.setMap(null);
            });
            kakao.maps.event.addListener(rect, 'click', (e) => {
                getAreaDetailHandler({
                    latitude: tile.latitude,
                    longitude: tile.longitude,
                });
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

function timeSlice({ time }) {
    //2022-01-03T00:54:14.000Z
    const timeObj = {
        year: time.slice(0, 4),
        month: time.slice(5, 7),
        day: time.slice(8, 10),
        hour: time.slice(11, 13),
        minute: time.slice(14, 16),
        second: time.slice(17, 19),
    };
    const ret = `${timeObj.year}년,${timeObj.month}월 ${timeObj.day}일 ${timeObj.hour}시 ${timeObj.minute}분 ${timeObj.second}초`;

    return ret;
}

const KakaoMapArea = ({
    getAreaCountButtonHandler,
    areaCount,
    getAreaDetailHandler,
    areaDetail,
}) => {
    const [map, setMap] = useState(null);
    const [bound, setBound] = useState(null);
    const [tiles, setTiles] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

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

    useEffect(async () => {
        await deleteTile();
        const newTiles = await makeTileList({
            areaCount,
            map,
            getAreaDetailHandler,
        });
        newTiles.forEach((tile) => {
            tile.setMap(map);
        });
        setTiles(newTiles);
    }, [areaCount]);

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

    const deleteTileHandler = async (e) => {
        e.preventDefault();
        await deleteTile();
    };

    const showAreaDetail = areaDetail.map((value, idx) => {
        const start = timeSlice({ time: value.starttime });
        const end = timeSlice({ time: value.endtime });
        return (
            <div key={idx}>
                <span>
                    기록번호 :{value.recordcode} & 레코드 시간 : {start} ~ {end}{' '}
                    & 들린 시간 : {value.time}
                </span>
            </div>
        );
    });

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
            <div>
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={(e) => {
                        getAreaCountButtonHandler(e, bound, startTime, endTime);
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
                <div>
                    <h3>시작시간이 더 뒤면 그냥 다 가지고옴. (선택없으면 00시 ~ 24시 기준)</h3>
                    <label htmlFor="start">시작 시간 ~ </label>
                    <label htmlFor="finish">끝 시간 : </label>
                    <input
                        type="time"
                        id="start"
                        onChange={e=>{
                            setStartTime(e.target.value);
                        }}
                        step={1}
                    />
                     ~
                    <input
                        type="time"
                        id="finish"
                        onChange={e=>{
                            setEndTime(e.target.value);
                        }}
                        step={1}
                    />
                </div>
            </div>
            <div>{showAreaDetail}</div>
        </div>
    );
};

export default KakaoMapArea;
