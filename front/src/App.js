import React, { useEffect, useState } from 'react';
import KakaoMap from './Kakao.map';
import { getLocation, getDistance } from './calc';
import InputForm from './InputForm';
import axios from 'axios';

function getFinDist(locationList) {
    const lastIdx = locationList.length - 1;
    //마지막이랑 처음이랑 길이차이가 많이나면 안됨.100meter만 허용
    const finDist = getDistance({
        lat1: locationList[0].latitude,
        lon1: locationList[0].longitude,
        lat2: locationList[lastIdx].latitude,
        lon2: locationList[lastIdx].longitude,
    });
    return finDist;
}

function App() {
    const [coords, setcoords] = useState({
        err: -3,
        time: null,
        latitude: -1,
        longitude: -1,
    });
    const [locationList, setLocationList] = useState([]);
    const [watchId, setWatchId] = useState(-1);
    const [recording, setRecording] = useState(false);
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');

    const usernameInputHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    };

    const codeInputHandler = (e) => {
        e.preventDefault();
        setCode(e.target.value);
    };

    //수동
    const locationButtenListener = async (e) => {
        e.preventDefault();
        const cur_coords = await getLocation();
        setcoords(cur_coords);
        setLocationList([...locationList, cur_coords]);
        setRecording(true);
    };

    //기본 종료
    const finishRecordButtenListenr = async (e) => {
        e.preventDefault();
        console.log(locationList);

        const finDist = getFinDist(locationList);
        if (locationList.length >= 3 && finDist < 0.1) {
            //결과 전송
        }
        setcoords({
            err: -3,
            time: null,
            latitude: -1,
            longitude: -1,
        });
        setLocationList([]);
        setRecording(false);
    };
    //자동 레코드
    const locationAutoButtenListener = (e) => {
        e.preventDefault();
        if (navigator.geolocation) {
            let before_record = null;
            let counter = 0;
            const newId = navigator.geolocation.watchPosition(
                async (position) => {
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
                        //이동거리가 50m미만이면 안바뀜
                        if (dist < 0.05) {
                            updateFlag = false;
                        }
                    }
                    if (updateFlag) {
                        setcoords(new_record);
                        before_record = new_record;

                        setLocationList((locationList) => [
                            ...locationList,
                            new_record,
                        ]);
                        new_record.counter = counter++;
                        const res = await axios.post('/api/coords', {
                            username,
                            code,
                            record: new_record,
                        });
                        console.log(res.data);
                    }
                },
                (err) => {
                    console.log(err.message);
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
            setRecording(true);
            setWatchId(newId);
        }
    };
    //자동 종료
    const finishAutoRecordButtonListener = async (e) => {
        e.preventDefault();
        if (watchId !== -1) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(-1);
            const finDist = getFinDist(locationList);
            if (locationList.length >= 3 && finDist < 0.1) {
                //결과 전송
                const res = await axios.post('/api/coords/finish', {
                    username,
                    code,
                });
            } else {
                alert('조건이 맞지않아 종료할 수 없습니다.');
            }

            setcoords({
                err: -3,
                time: null,
                latitude: -1,
                longitude: -1,
            });
            setLocationList([]);
            setRecording(false);
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
                <KakaoMap coords={coords} recording={recording} />
            </div>
            <br />
            <span>
                Show current location ..
                <InputForm
                    username={username}
                    code={code}
                    usernameInputHandler={usernameInputHandler}
                    codeInputHandler={codeInputHandler}
                />
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
                    disabled={!recording}
                >
                    FINISH
                </button>
                <br />
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={locationAutoButtenListener}
                    disabled={recording}
                >
                    AUTO RECORD
                </button>
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={finishAutoRecordButtonListener}
                    disabled={!recording}
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
