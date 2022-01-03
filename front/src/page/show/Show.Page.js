import React, { useState, useEffect } from 'react';

import KakaoMap from './Kakao.map.show';
import axios from 'axios';
import MaterialTable from '../../component/MaterialTable';

const ShowPage = () => {
    const [selectedCoords, setSelectedCoords] = useState(-1);

    const [userList, setUserList] = useState([]);
    const [recordList, setRecordList] = useState([]);
    const [coordList, setCoordList] = useState([]);

    useEffect(async () => {
        try {
            const { data } = await axios.get('/api/user');
            if (data.success === false) {
                throw new Error('유저 정보를 받아오지 못했습니다.');
            }
            setUserList(data.result);
        } catch (err) {
            alert(err.message);
        }
    }, []);

    const userSelectorHandler = async (e, username) => {
        e.preventDefault();
        setCoordList([]);
        try {
            const { data } = await axios.get(`/api/record/${username}`);
            if (data.success === false) {
                throw new Error('유저 레코드 정보 가져오기 실패');
            }
            setRecordList(data.result);
        } catch (err) {
            alert(err.message);
        }
    };

    const recordSelectorHandler = async (e, recordcode) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/api/coord/${recordcode}`);
            if (data.success === false) {
                throw new Error('레코드 상세정보 가져오기 실패');
            }
            setCoordList(data.result);
        } catch (err) {
            alert(err.message);
        }
    };

    const corodsSelectorHandler = async (e, counter) => {
        e.preventDefault();
        setSelectedCoords(counter);
    };

    return (
        <div>
            <KakaoMap coordList={coordList} selectedCoords={selectedCoords} />
            <MaterialTable
                tableName={'USER NAME'}
                data={userList}
                showType={'username'}
                selectType={'username'}
                selector={userSelectorHandler}
            />
            <MaterialTable
                tableName={'USER RECORD'}
                data={recordList}
                showType={'recordcode'}
                selectType={'recordcode'}
                selector={recordSelectorHandler}
            />
            <MaterialTable
                tableName={'COORDS'}
                data={coordList}
                showType={'time'}
                selectType={'counter'}
                selector={corodsSelectorHandler}
            />
        </div>
    );
};

export default ShowPage;
