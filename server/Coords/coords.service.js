const { createClient } = require('redis');
const client = createClient();

client.connect();
client.on('error', (err) => {
    console.error(err);
});
client.on('ready', () => {
    console.log('client is ready');
});
const saveRecord =  ({ code, record }) => {
    return new Promise(async(resolve, reject)=>{
        await client.hSet(
            `${code}`,
            `${record.counter}`,
            JSON.stringify({
                time: record.time,
                latitude: record.latitude,
                longitude: record.longitude,
            })
        );
        resolve(true);
    }).then(res=>{
        return res;    
    }).catch(e=>{
        throw new Error(e.message);
    });
};

const finishRecording =  ({ code }) => {
    return new Promise(async(resolve, reject)=>{
        const records = await client.hGetAll(`${code}`);
        //DB에 저장하자.
        console.log(records);
        resolve(true);
    }).then(res=>{  
        return true;
    }).catch(e=>{
        return false;
    })
};

module.exports = {
    saveRecord,
    finishRecording,
};
