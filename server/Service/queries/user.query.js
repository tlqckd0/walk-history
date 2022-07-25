const create_user = `INSERT INTO 
user (user_id, user_pw, user_name) 
values (?,?,?)`;

const find_user = `select user_code, user_id, name, state, open 
FROM user 
where user_id = ? 
and user_pw = ?`;

module.exports = {
    create_user,
    find_user,
};
