import React, { useState } from 'react';

import KakaoMap from './Kakao.map.show';
import axios from 'axios';

const ShowPage = () => {
    const [username, setUsername] = useState('');
    const [userList, setUserList] = useState([]);

    const usernameInputHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    };

    return (
        <div>
            <KakaoMap />
            <br />
            <div style={{ border: 'solid 1px black', margin: '20px' }}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="code">username</label>
                            </td>
                            <td>
                                <input
                                    onChange={usernameInputHandler}
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowPage;
