const { createClient } = require('redis');
const client = createClient();

client.connect();
client.on('error', (err) => {
    console.error(err);
});
client.on('ready', () => {
    console.log('client is ready');
});

const saveCurrentRecord = async ({ usercode, record }) => {
    await client.lPush(
        `${usercode}`,
        JSON.stringify({
            counter: record.counter,
            latitude: record.latitude,
            longitude: record.longitude,
        })
    );
};

const getRecord = async ({ usercode }) => {
    const data = await client.lRange(`${usercode}`, 0, -1);
    return data;
};

const deleteRecord = async ({ usercode }) => {
    await client.del(`${usercode}`);
};

module.exports = {
    saveCurrentRecord,
    getRecord,
    deleteRecord,
};
