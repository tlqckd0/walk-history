import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from '../../component/MaterialTable';
import KakaoMapArea from './Kakao.map.area';

const AreaPage = () => {
    const [selectedRecords, setSelectedRecords] = useState(-1);
    const [selectedUsername, setSelectedUsername] = useState(-1);

    const [userList, setUserList] = useState([]);
    const [recordList, setRecordList] = useState([]);

    useEffect(async () => {
        try {
            const { data } = await axios.get('/api/user');
            if (data.success === false) {
                throw new Error('유저 정보를 받아오지 못했습니다.');
            }
            setUserList([...data.result, { username: 'Total' }]);
        } catch (err) {
            alert(err.message);
        }
    }, []);
    const userSelectorHandler = async (e, username) => {
        e.preventDefault();
        setSelectedUsername(username);
        try {
            const { data } = await axios.get(`/api/record/${username}`);
            if (data.success === false) {
                throw new Error('유저 레코드 정보 가져오기 실패');
            }
            setRecordList([...data.result, { recordcode: 'Total' }]);
        } catch (err) {
            alert(err.message);
        }
    };

    const recordSelectorHandler = async (e, recordcode) => {
        e.preventDefault();
        setSelectedRecords(recordcode);
    };

    const getDataButtonHandler = async (e, value) => {
        e.preventDefault();
        try {
            if (selectedRecords === -1 || selectedUsername === -1) {
                throw new Error('유저랑 레코드 선택하세요');
            }
            const { data } = await axios.get(
                `/api/area/${selectedUsername}/${selectedRecords}/${value.sw_lat}/${value.sw_lon}/${value.ne_lat}/${value.ne_lon}/`
            );
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ border: '1px solid grey' }}>
            <KakaoMapArea getDataButtonHandler={getDataButtonHandler}/>
            {selectedUsername === -1 ? (
                <h3>유저 선택</h3>
            ) : (
                <div>
                    <h3>
                        {selectedUsername === 'Total'
                            ? '전체 유저'
                            : '선택한 유저 : ' + selectedUsername}{' '}
                        {selectedRecords === -1 ? (
                            <span>레코드 선택</span>
                        ) : (
                            <span>
                                {selectedRecords === 'Total'
                                    ? '& 전체 레코드'
                                    : '& 선택한 레코드 : ' + selectedRecords}
                            </span>
                        )}
                    </h3>
                </div>
            )}{' '}
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
        </div>
    );
};

export default AreaPage;
