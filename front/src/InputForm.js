import React from 'react';

const InputForm = ({
    username,
    code,
    usernameInputHandler,
    codeInputHandler,
}) => {
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="code">code</label>
                        </td>
                        <td>
                            <input
                                onChange={codeInputHandler}
                                id="code"
                                name="code"
                                type="text"
                                value={code}
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
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InputForm;
