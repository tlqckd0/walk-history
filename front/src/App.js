import React, { useEffect, useState } from 'react';
import KakaoMap from './Kakao.map';
import { getLocation, getDistance ,getLocationAuto } from './calc';

function App() {
    const [coords, setcoords] = useState({
        err: -3,
        time: null,
        latitude: -1,
        longitude: -1,
    });
    const [locationList, setLocationList] = useState([]);

    //수동
    const locationButtenListener = async (e) => {
        e.preventDefault();
        const cur_coords = await getLocation();
        setcoords(cur_coords);
        setLocationList([...locationList, cur_coords]);
    };

    //자동
    const locationAutoButtenListener = async (e)=>{
        e.preventDefault();
        const id = await getLocationAuto(setcoords)
    }

    //종료
    const finishRecordButtenListenr = async (e) => {
        e.preventDefault();
        console.log(locationList);
        const lastIdx = locationList.length - 1;
        //마지막이랑 처음이랑 길이차이가 많이나면 안됨.100meter만 허용
        const fin_dist = getDistance({
            lat1: locationList[0].latitude,
            lon1: locationList[0].longitude,
            lat2: locationList[lastIdx].latitude,
            lon2: locationList[lastIdx].longitude,
        });
        setcoords({
            err: -3,
            time: null,
            latitude: -1,
            longitude: -1,
        });
        setLocationList([]);
    };

    const locationToString = (coord, idx) => (
        <div key={idx}>
            ({idx}) Time : {coord.time} & latitude : {coord.latitude} &
            longitude : {coord.longitude}{' '}
        </div>
    );

    const showLocationList = locationList.map((coord, idx) =>
        locationToString(coord, idx)
    );

    return (
        <div className="App">
            <div>
                <KakaoMap coords={coords} />
            </div>
            <br />
            <span>
                Show current location ..
                <br />
                {coords.latitude === -1 ? (
                    <div>`click UPDATE`</div>
                ) : (
                    locationToString(coords, 'Current')
                )}
                <button
                    style={{ width: '100px', height: '50px', margin: '20px' }}
                    onClick={locationAutoButtenListener}
                >
                    AutoStart
                </button>
                <button
                    style={{ width: '100px', height: '50px', margin: '20px' }}
                    onClick={locationButtenListener}
                >
                    UPDATE
                </button>
                <button
                    style={{ width: '100px', height: '50px', margin: '20px' }}
                    onClick={finishRecordButtenListenr}
                >
                    FINISH
                </button>
                <br />
                show location List ..
                {showLocationList}
            </span>
        </div>
    );
}

export default App;
