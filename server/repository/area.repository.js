module.exports = class AreaRepository {
    #pool;

    //데이터 삽입
    #InsertAreaSQL = `INSERT INTO area (usercode, latitude, longitude,recordcode,time) VALUES(?,?,?,?,?)`;

    //전체유저 좌표데이터 추출
    #FindDataByLatLonSQL = `SELECT a.usercode, a.recordcode, r.starttime, r.endtime , a.time 
    FROM area a, record r 
    where a.recordcode = r.recordcode 
    and latitude = ? 
    and longitude = ?`;

    //특정유저 좌표데이터 추출
    #FindDataByLatLonUsernameSQL = `SELECT a.usercode, a.recordcode, r.starttime, r.endtime  , a.time 
    FROM area a, record r 
    WHERE exists ( 
        select 1 
        from user u 
        where u.username = ? 
        and u.usercode = a.usercode 
        )  
    and a.recordcode = r.recordcode 
    and latitude = ?
    and longitude = ?
    `;

    //전체유저 범위 Count 추출
    #FindAreaByLatLonSQL = `SELECT latitude, longitude, count(*) as count 
    FROM area a 
    WHERE a.latitude between ? and ? 
    and a.longitude between ? and ? 
    and a.time between ? and ? 
    group by latitude,longitude; `;

    //특정유저 범위 Count 추출
    #FindAreaByLatLonUsernameSQL = `SELECT latitude, longitude, count(*) as count 
    FROM area a 
    WHERE exists ( 
        select 1 
        from user u 
        where u.username = ? 
        and u.usercode = a.usercode 
        ) 
    and a.latitude between ? and ? 
    and a.longitude between ? and ? 
    and a.time between ? and ? 
    group by latitude,longitude; `;

    constructor(pool) {
        this.#pool = pool;
    }

    InsertArea = async ({
        usercode,
        latitude,
        longitude,
        recordcode,
        time,
    }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#InsertAreaSQL, [
                usercode,
                latitude,
                longitude,
                recordcode,
                time,
            ]);
            await connection.release();
        } catch (err) {
            throw err;
        }
    };

    FindAreaDetail = async ({ latitude, longitude }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindDataByLatLonSQL, [
                latitude,
                longitude,
            ]);
            await connection.release();
            return rows;
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    };

    FindUserAreaDetail = async ({ username, latitude, longitude }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(
                this.#FindDataByLatLonUsernameSQL,
                [username, latitude, longitude]
            );
            await connection.release();
            return rows;
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    };

    FindTotalCountArea = async ({
        bottom,
        top,
        left,
        right,
        startTime,
        endTime,
    }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindAreaByLatLonSQL, [
                bottom,
                top,
                left,
                right,
                startTime,
                endTime,
            ]);
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };

    FindAreaCountByUserName = async ({
        username,
        bottom,
        top,
        left,
        right,
        startTime,
        endTime,
    }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(
                this.#FindAreaByLatLonUsernameSQL,
                [username, bottom, top, left, right, startTime, endTime]
            );
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };
};
