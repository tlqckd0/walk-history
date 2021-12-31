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

const KakaoMap = () => {
    const [map,setMap] = useState(null);

    //처음 지도 그리기
    useEffect(()=>{
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(33.4507, 126.5706) };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    },[])


    
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
