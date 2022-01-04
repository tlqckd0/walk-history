import React, { useState } from 'react';
import { getDistance, getFinDist } from '../util/calc';
import InputForm from './InputForm';
import axios from 'axios';
import CButton from '../../component/CButton';
import KakaoMapRecord from './Kakao.map.record';

const RecordPage = () => {
    const [coords, setcoords] = useState({
        err: -1,
    });
    const [locationList, setLocationList] = useState([]);
    const [watchId, setWatchId] = useState(-1);

    const [recording, setRecording] = useState(false); //기록 중
    const [readyRecord, setReadyRecord] = useState(false); //시작가능
    const [userCheck, setUserCheck] = useState(false); //유저 확인

    const [username, setUsername] = useState('');
    const [usercode, setUsercode] = useState('');
    const [recordcode, setRecordcode] = useState(-1);

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
            setUserCheck(true);
            if (data.status === 0) {
                //기록 시작가능.
                setReadyRecord(true);
            } else {
                //이전 기로 리셋필요.
                setReadyRecord(false);
            }
        } catch (err) {
            alert('유저 에러');
        }
    };

    //이전 기록 리셋
    const resetButtonHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/record/reset', {
                usercode,
            });
            if (data.success === true) {
                setReadyRecord(true);
            } else {
                throw new Error('서버에러');
            }
            alert('기록 삭제 완료');
        } catch (err) {
            alert(err.message);
        }
    };

    //자동 레코드
    const locationAutoButtenListener = async (e) => {
        e.preventDefault();

        if (navigator.geolocation) {
            try {
                const { data } = await axios.post('/api/record/start', {
                    usercode,
                    username,
                });
                if (data.success === false) {
                    throw new Error('Record Start Error');
                }
                setRecordcode(data.recordcode);
                setRecording(false);

                let before_record = null;
                let counter = 0;

                const newId = navigator.geolocation.watchPosition(
                    async (position) => {
                        let updateFlag = true;
                        const new_record = {
                            err: 0,
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
                            const res = await axios.post('/api/record', {
                                usercode,
                                record: new_record,
                            });
                        }
                    },
                    (err) => {
                        throw err;
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 10000,
                        timeout: 5000,
                    }
                );
                setRecording(true);
                setWatchId(newId);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert('GPS문제, 기록불가');
        }
    };
    //자동 종료
    const finishAutoRecordButtonListener = async (e) => {
        e.preventDefault();
        try {
            if (watchId !== -1) {
                navigator.geolocation.clearWatch(watchId);
                setWatchId(-1);
                const finDist = getFinDist(locationList);
                let finish = 1;
                if (locationList.length < 3 || finDist > 0.2) {
                    finish = 0;
                }
                const { data } = await axios.post('/api/record/finish', {
                    finish,
                    usercode,
                    recordcode,
                });
                if (finish === 0) {
                    alert(
                        '정상적인 종료 조건이 아닙니다.(3곳 이상 방문, 시작점, 마지막점 200m이내)'
                    );
                }
                if (data.success === false) {
                    throw new Error(data.message);
                }
                setLocationList([]);
                setRecordcode(-1);
                setReadyRecord(true);
                setRecording(false);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const locationToString = (coord, idx) => (
        <div key={idx}>
            latitude : {coord.latitude} & longitude : {coord.longitude}{' '}
        </div>
    );

    const showLocationList = locationList.map((coord, idx) =>
        locationToString(coord, idx)
    );

    return (
        <span>
            <div>
                <KakaoMapRecord coords={coords} recording={recording} />
            </div>
            <InputForm
                username={username}
                code={usercode}
                usernameInputHandler={usernameInputHandler}
                usercodeInputHandler={usercodeInputHandler}
                block={userCheck}
            />
            <CButton
                disableStatus={userCheck}
                value={'계정확인'}
                type={-1}
                onClickHandler={checkUserStatus}
            />
            <br />
            <CButton
                disableStatus={!(userCheck && readyRecord && !recording)}
                value={'기록시작'}
                type={-1}
                onClickHandler={locationAutoButtenListener}
            />
            <CButton
                disableStatus={!(userCheck && readyRecord && recording)}
                value={'기록종료'}
                type={-1}
                onClickHandler={finishAutoRecordButtonListener}
            />
            <CButton
                disableStatus={!(userCheck && !readyRecord)}
                value={'잘못된 기록 삭제'}
                type={-1}
                onClickHandler={resetButtonHandler}
            />
            <br />
            show location List ..
            {showLocationList}
        </span>
    );
};

export default RecordPage;
