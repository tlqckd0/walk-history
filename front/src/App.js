import React, { useEffect, useState } from 'react';
import KakaoMap from './Kakao.map';
import { getLocation, getDistance } from './calc';

function App() {
    const [coords, setcoords] = useState({
        err: -3,
        time: null,
        latitude: -1,
        longitude: -1,
    });
    const [locationList, setLocationList] = useState([]);
    const [watchId, setWatchId] = useState(-1);

    //수동
    const locationButtenListener = async (e) => {
        e.preventDefault();
        const cur_coords = await getLocation();
        setcoords(cur_coords);
        setLocationList([...locationList, cur_coords]);
    };

    //기본 종료
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
    //자동 레코드
    const locationAutoButtenListener = (e) => {
        e.preventDefault();
        if (navigator.geolocation) {
            let before_record = null;
            const newId = navigator.geolocation.watchPosition(
                (position) => {
                    let updateFlag = true;
                    const now = new Date();
                    const new_record = {
                        err: 0,
                        time: now.toLocaleTimeString(),
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    //시작
                    if (before_record !== null) {
                        const dist = getDistance({
                            lat1: before_record.latitude,
                            lon1: before_record.longitude,
                            lat2: new_record.latitude,
                            lon2: new_record.longitude,
                        });
                        if(dist < 0.05){
                            updateFlag = false;
                        }
                    } 

                    if(updateFlag){
                        setcoords(new_record);
                        before_record = new_record;
                        setLocationList((locationList) => [
                            ...locationList,
                            new_record,
                        ]);
                    }
                },
                (err) => {
                    console.log(err.message);
                },
                { enableHighAccuracy: false, maximumAge: 10000, timeout: 5000 }
            );
            setWatchId(newId);
        }
    };
    //자동 종료
    const finishAutoRecordButtonListener = (e) => {
        e.preventDefault();
        console.log(locationList);
        if (watchId !== -1) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(-1);
            setcoords({
                err: -3,
                time: null,
                latitude: -1,
                longitude: -1,
            });
            setLocationList([]);
        }
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
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={locationButtenListener}
                >
                    UPDATE
                </button>
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={finishRecordButtenListenr}
                >
                    FINISH
                </button>
                <br />
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={locationAutoButtenListener}
                >
                    AUTO RECORD
                </button>
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={finishAutoRecordButtonListener}
                >
                    AUTO STOP
                </button>
                <br />
                show location List ..
                {showLocationList}
            </span>
        </div>
    );
}

export default App;
