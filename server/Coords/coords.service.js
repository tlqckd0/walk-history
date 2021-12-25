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
        
        const now = new Date();
        await client.lPush(`${code}`,JSON.stringify({
            counter:record.counter,
            time: now.toLocaleTimeString(),
            latitude: record.latitude,
            longitude: record.longitude,
        }))
        resolve(true);
    }).then(res=>{
        return res;    
    }).catch(e=>{
        throw new Error(e.message);
    });
};

const finishRecording = async ({ code }) => {    
    const res = await client.lRange(`${code}`,0,-1);
    console.log(JSON.parse(res));
    return true;
};

module.exports = {
    saveRecord,
    finishRecording,
};
