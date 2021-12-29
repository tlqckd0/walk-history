import React from 'react';

const CButton = ({  disableStatus, value }) => {
    return (
        <button
            style={{ width: '150px', height: '50px', margin: '10px' }}
            disabled={disableStatus}
        >
            {value}
        </button>
    );
};

export default CButton;
