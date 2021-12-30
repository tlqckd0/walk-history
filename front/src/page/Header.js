import React from 'react';
import CButton from '../component/CButton';

const Header = ({ClickHandler}) => {
    return (
        <div>
            <CButton
                disabled={false}
                value="기록하기"
                type={0}
                onClickHandler={ClickHandler}
            />
            <CButton
                disabled={false}
                value="기록 보기"
                type={1}
                onClickHandler={ClickHandler}
            />
            <CButton
                disabled={false}
                value="구역 확인하기"
                type={2}
                onClickHandler={ClickHandler}
            />
        </div>
    );
};

export default Header;
