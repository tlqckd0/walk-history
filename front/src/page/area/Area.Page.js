import React ,{useState,useEffect}from "react";
import axios from 'axios';
import MaterialTable from '../../component/MaterialTable';
import KakaoMapArea from "./Kakao.map.area";

const AreaPage = ()=>{
    
    const [userList, setUserList] = useState([]);

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

        try {
            console.log(username);
        } catch (err) {
            alert(err.message);
        }
    };
    return(
        <div>
            <KakaoMapArea/>
            <MaterialTable
                tableName={'USER NAME'}
                data={userList}
                showType={'username'}
                selectType={'username'}
                selector={userSelectorHandler}
            />
        </div>
    )
}

export default AreaPage;

