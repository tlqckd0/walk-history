import React from 'react';

const CButton = ({ disableStatus, value, type, onClickHandler }) => {
    return (
        <button
            style={{ width: '150px', height: '50px', margin: '10px' }}
            disabled={disableStatus}
            onClick={(e) => {
                if (type === -1) {
                    onClickHandler(e);
                } else {
                    onClickHandler(e, type);
                }
            }}
        >
            {value}
        </button>
    );
};

export default CButton;
