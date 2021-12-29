import React from 'react';

const InputForm = ({
    username,
    code,
    usernameInputHandler,
    usercodeInputHandler,
    block
}) => {
    return (
        <div 
        style={{border:'solid 1px black', margin:'20px'}}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="code">code</label>
                        </td>
                        <td>
                            <input
                                onChange={usercodeInputHandler}
                                id="code"
                                name="code"
                                type="text"
                                value={code}
                                disabled={block}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="username">username</label>
                        </td>
                        <td>
                            <input
                                onChange={usernameInputHandler}
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                disabled={block}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InputForm;
