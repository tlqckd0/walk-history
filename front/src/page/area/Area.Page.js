import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from '../../component/MaterialTable';
import KakaoMapArea from './Kakao.map.area';

const AreaPage = () => {
    const [selectedUsername, setSelectedUsername] = useState(-1);
    const [userList, setUserList] = useState([]);
    const [selectTotal, setSelectTotal] = useState(false);
    const [areaData, setAreaData] = useState([]);

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
    };

    const getDataButtonHandler = async (e, value) => {
        e.preventDefault();
        try {
            if(selectedUsername === -1){
                throw new Error("사용자를 선택하세요");
            }
            if (selectedUsername === 'Total') {
                setSelectTotal(true);
                const { data } = await axios.get(
                    `/api/area/${value.sw_lat}/${value.ne_lat}/${value.sw_lon}/${value.ne_lon}`
                );
                if(data.success === false){
                    throw new Error('데이터 오류');
                }
                setAreaData(data.result);
            } else {
                setSelectTotal(false);
                const { data } = await axios.get(
                    `/api/area/${selectedUsername}/${value.sw_lat}/${value.ne_lat}/${value.sw_lon}/${value.ne_lon}`
                );
                if(data.success === false){
                    throw new Error('데이터 오류');
                }
                setAreaData(data.result);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ border: '1px solid grey' }}>
            <KakaoMapArea getDataButtonHandler={getDataButtonHandler} areaData={areaData} />
            {selectedUsername === -1 ? (
                <h3>유저 선택</h3>
            ) : (
                <div>
                    <h3>
                        {selectedUsername === 'Total'
                            ? '전체 유저'
                            : '선택한 유저 : ' + selectedUsername}{' '}
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
        </div>
    );
};

export default AreaPage;
