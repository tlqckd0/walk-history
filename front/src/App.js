import React, { useEffect, useState } from 'react';
import KakaoMap from './component/Kakao.map';
import { getLocation, getDistance, getFinDist } from './calc';
import InputForm from './component/InputForm';
import axios from 'axios';
import CButton from './component/CButton';

const statusList = ['기록 시작가능', '기록중', '기록 저장중', '기록완료'];
const mapTypeList = ['기록모드', '기록 열람', '분포 확인'];

function App() {
    const [coords, setcoords] = useState(null);
    const [locationList, setLocationList] = useState([]);
    const [watchId, setWatchId] = useState(-1);

    const [recording, setRecording] = useState(false); //기록 중
    const [readyRecord, setReadyRecord] = useState(false);

    const [status, setStatus] = useState(0); //기록 타입
    const [mapType, setMapType] = useState(0); //

    const [username, setUsername] = useState('');
    const [usercode, setUsercode] = useState('');
    const [recordcode, setRecordcode] = useState(-1);

    useEffect(() => {
        reset();
    }, []);
    const reset = () => {
        setcoords({
            err: -3,
            time: null,
            latitude: -1,
            longitude: -1,
        });
        setRecording(false);
        setLocationList([]);
        setStatus(0);
    };

    const usernameInputHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    };

    const usercodeInputHandler = (e) => {
        e.preventDefault();
        setUsercode(e.target.value);
    };
    //이름, 코드 입력
    const checkUserStatus = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(
                `/api/user/${usercode}/${username}`
            );
            console.log(data);
            if (data.status === 0) {
                setReadyRecord(true);
                //기록가능.
            } else {
                setReadyRecord(false);
                //리셋해라.
            }
        } catch (err) {
            alert('유저 에러');
        }
    };

    //이전 기록 리셋
    const resetButtonHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/coords/reset', {
                usercode,
            });
            if (data.success === true) {
            } else {
                throw new Error('서버에러');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // //자동 레코드
    // const locationAutoButtenListener = async (e) => {
    //     e.preventDefault();

    //     if (navigator.geolocation) {
    //         setRecording(false);
    //         try {
    //             const { data } = await axios.post('/api/start', {
    //                 usercode,
    //                 username,
    //             });
    //             console.log(data);
    //             let before_record = null;
    //             let counter = 0;
    //             const newId = navigator.geolocation.watchPosition(
    //                 async (position) => {
    //                     let updateFlag = true;
    //                     const now = new Date();
    //                     const new_record = {
    //                         err: 0,
    //                         time: now.toLocaleTimeString(),
    //                         latitude: position.coords.latitude,
    //                         longitude: position.coords.longitude,
    //                     };
    //                     //시작
    //                     if (before_record !== null) {
    //                         const dist = getDistance({
    //                             lat1: before_record.latitude,
    //                             lon1: before_record.longitude,
    //                             lat2: new_record.latitude,
    //                             lon2: new_record.longitude,
    //                         });
    //                         //이동거리가 50m미만이면 안바뀜
    //                         if (dist < 0.05) {
    //                             updateFlag = false;
    //                         }
    //                     }
    //                     if (updateFlag) {
    //                         setcoords(new_record);
    //                         before_record = new_record;

    //                         setLocationList((locationList) => [
    //                             ...locationList,
    //                             new_record,
    //                         ]);
    //                         new_record.counter = counter++;
    //                         const res = await axios.post('/api/coords', {
    //                             usercode,
    //                             recordcode: data.code,
    //                             record: new_record,
    //                         });
    //                         console.log(res.data);
    //                     }
    //                 },
    //                 (err) => {
    //                     console.log(err.message);
    //                 },
    //                 {
    //                     enableHighAccuracy: true,
    //                     maximumAge: 10000,
    //                     timeout: 5000,
    //                 }
    //             );
    //             setRecording(true);
    //             setWatchId(newId);
    //         } catch (err) {
    //             alert('에러 발생');
    //             reset();
    //         }
    //     } else {
    //         alert('GPS문제, 기록불가');
    //     }
    // };
    // //자동 종료
    // const finishAutoRecordButtonListener = async (e) => {
    //     e.preventDefault();
    //     if (watchId !== -1) {
    //         navigator.geolocation.clearWatch(watchId);
    //         setWatchId(-1);
    //         const finDist = getFinDist(locationList);
    //         let finish = true;
    //         setStatus(2); //기록 프로세스중.
    //         if (locationList.length < 3 || finDist > 0.2) {
    //             finish = false;
    //             alert('조건이 맞지않아 종료할 수 없습니다.');
    //         }
    //         axios.post(
    //             '/api/coords/finish',
    //             {
    //                 error: finish,
    //                 username,
    //                 usercode,
    //             },
    //             (response) => {
    //                 setStatus(3);
    //             }
    //         );
    //         reset();
    //     }
    // };

    const showStatus = (
        <div style={{ border: 'solid 1px black', margin: '20px' }}>
            <div>
                <h3>모드 : {mapTypeList[mapType]}</h3>
            </div>
            <div>
                <h3>기록 상태 : {statusList[status]}</h3>
            </div>
        </div>
    );

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
            {/* <div>
                <KakaoMap coords={coords} recording={recording} />
            </div> */}
            <CButton value="기록하기" />
            <CButton value="기록 보기" />
            <CButton value="구역 확인하기" />
            <br />
            {showStatus}
            <span>
                <InputForm
                    username={username}
                    code={usercode}
                    usernameInputHandler={usernameInputHandler}
                    usercodeInputHandler={usercodeInputHandler}
                    block={readyRecord}
                />
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={checkUserStatus}
                    disabled={readyRecord}
                >
                    {'계정확인'}
                </button>
                <br />
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    //onClick={locationAutoButtenListener}
                    /* 기록중일때, 저장중일때 사용불가능 */
                    disabled={
                        readyRecord ||
                        recording &&
                        (status === 1 || status === 2)
                    }
                >
                    {'기록시작'}
                </button>
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                   // onClick={finishAutoRecordButtonListener}
                    disabled={!recording && (status === 0 || status === 3)}
                >
                    {'기록종료'}
                </button>
                <button
                    style={{ width: '150px', height: '50px', margin: '10px' }}
                    onClick={resetButtonHandler}
                    disabled={
                        !readyRecord &&
                        recording &&
                        (status === 0 || status === 3)
                    }
                >
                    {'잘못된 기록 삭제'}
                </button>
                <br />
                show location List ..
                {showLocationList}
            </span>
        </div>
    );
}

export default App;
