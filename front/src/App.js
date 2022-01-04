import React, { useState } from 'react';
import AreaPage from './page/area/Area.Page';

import Header from './page/Header';
import RecordPage from './page/record/Record.Page';
import ShowPage from './page/show/Show.Page';

const mapTypeList = ['기록모드', '기록 열람', '영역 확인'];

function App() {
    const [mapType, setMapType] = useState(0); //

    const changeMapTypeHandler = (e, type) => {
        e.preventDefault();
        setMapType(type);
    };

    const showStatus = (
        <div style={{ border: 'solid 1px black', margin: '20px' }}>
            <div>
                <h3>모드 : {mapTypeList[mapType]}</h3>
            </div>
        </div>
    );

    return (
        <div className="App">
            <Header ClickHandler={changeMapTypeHandler} />
            <br />
            {showStatus}
            {mapType === 0 ? (
                <RecordPage />
            ) : mapType === 1 ? (
                <ShowPage/>
            ) : (
                <AreaPage/>
            )}
        </div>
    );
}

export default App;
