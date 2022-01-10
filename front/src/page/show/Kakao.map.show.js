/* global kakao */
import React, { useEffect, useState } from 'react';

const { kakao } = window;

function lineMaker({ geoLine, color }) {
    let ret = null;
    const path = [
        new kakao.maps.LatLng(geoLine[0].latitude, geoLine[0].longitude),
        new kakao.maps.LatLng(geoLine[1].latitude, geoLine[1].longitude),
    ];
    ret = new kakao.maps.Polyline({
        path,
        endArrow: true,
        strokeWeight: 2,
        strokeColor: color, //'#db4040'
        strokeOpacity: 1,
        strokeStyle: 'solid',
    });
    return ret;
}
function toGeo({ coord_line }) {
    const ret = [];
    ret.push({
        latitude: coord_line.from_latitude,
        longitude: coord_line.from_longitude,
    });
    ret.push({
        latitude: coord_line.to_latitude,
        longitude: coord_line.to_longitude,
    });
    return ret;
}


const KakaoMapShow = ({ coordList, selectedCoords }) => {
    const [map, setMap] = useState(null);
    const [polylineList, setPolylineList] = useState([]);

    //처음 지도 그리기
    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            level: 4,
            center: new kakao.maps.LatLng(37.495328, 126.4878233),
        };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    }, []);

    //빨간색
    useEffect(() => {
        if (coordList.length > 0) {
            polylineList.forEach((polyline) => {
                polyline.setMap(null);
                polyline = null;
            });

            const newLine = coordList.map((coord_line) => {
                const polyline = lineMaker({
                    geoLine: toGeo({ coord_line }),
                    color: '#db4040',
                });
                polyline.setMap(map);
                return polyline;
            });
            newLine[0].setOptions({
                strokeColor:'#08298A'
            })
            setPolylineList(newLine);
            const LL = new kakao.maps.LatLng(
                coordList[0].from_latitude,
                coordList[0].from_longitude
            );
            map.setCenter(LL);
        }
    }, [coordList]);

    //파란색 -> 그 선만 바꾸는 방법이 없을까.
    useEffect(() => {
        if (selectedCoords !== -1 && coordList.length > 0) {
            polylineList.forEach((polyline) => {
                polyline.setMap(null);
                polyline = null;
            });
            const newLine = coordList.map((coord_line,idx) => {
                const polyline = lineMaker({
                    geoLine: toGeo({ coord_line }),
                    color: idx === selectedCoords? '#08298A':'#db4040',
                });
                polyline.setMap(map);
                return polyline;
            });
            setPolylineList(newLine);

        }
    }, [selectedCoords]);

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

export default KakaoMapShow;
