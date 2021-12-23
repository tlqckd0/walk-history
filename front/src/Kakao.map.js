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

const KakaoMap = ({ coords }) => {
    const [walkpolylineList, setWalkpolylineList] = useState([]);
    const [beforeCoord, setBeforeCoord] = useState(null);
    const [map,setMap] = useState(null);

    //처음 지도 그리기
    useEffect(()=>{
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(33.450701, 126.570667) };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    },[])

    //좌표추가 및 라인 그리기
    useEffect(() => {
        if(coords.err === 0){
            const LatLon = new kakao.maps.LatLng(
                coords.latitude,
                coords.longitude
            );
            map.setCenter(LatLon);
            if(beforeCoord !== null){
                const polyline = line(beforeCoord, coords);
                if(polyline !== null){
                    setWalkpolylineList([...walkpolylineList, polyline]);
                    polyline.setMap(map);
                }
            }
            setBeforeCoord(coords);
        }

    }, [coords]);
    return (
        <div
            style={{
                width: '100%',
                display: 'inline-block',
                marginLeft: '5px',
                marginRight: '5px',
            }}
        >
            <div id="map" style={{ width: '99%', height: '500px' }}></div>
        </div>
    );
};

export default KakaoMap;
