module.exports = class RecordRepository {
    //0.기록중, 1. 기록완료, 2. 기록애러

    #pool;

    #CreateRecordSQL = `INSERT INTO RECORD (USERCODE, STARTTIME, STATUS) VALUES(?,sysdate(),0)`;
    #FindCurrentRecordCodeSQL =
        'SELECT MAX(RECORDCODE) as recordcode FROM RECORD where USERCODE = ? and STATUS = ?';
    #FinishRecordSQL =
        'UPDATE RECORD set STATUS = ?, ENDTIME = sysdate() where RECORDCODE = ?';
    #FindRecordByUsername =
        'SELECT recordcode, starttime, endtime FROM record r WHERE exists (select 1 from user u where u.usercode = r.usercode and u.username = ?) and r.status = 1';

        
    constructor(pool) {
        this.#pool = pool;
    }

    createRecord = async ({ usercode }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#CreateRecordSQL, [usercode]);
            await connection.release();
        } catch (err) {
            throw err
        }
    };

    findRecordByUserName = async({username})=>{
        try{
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindRecordByUsername,[username]);
            await connection.release();
            return rows;
        }catch(err){
            throw err;
        }
    }


    findCurrentRecordByStatus = async ({ usercode, status }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(
                this.#FindCurrentRecordCodeSQL,
                [usercode, status]
            );
            await connection.release();
            return rows[0];
        } catch (err) {
            throw err
        }
    };

    finishRecord = async ({ recordcode, status }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#FinishRecordSQL, [status, recordcode]);
            await connection.release();
        } catch (err) {
            throw err
        }
    };
};
