const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/record', require('./Record/record.controller'));
app.use('/api/user',require('./User/user.controller'));
app.use('/api/coord',require('./Coord/coord.controller'));

app.use((req, res, next) => {
    //no url
    res.status(404).json({
        success: false,
        message: 'No URL',
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

module.exports = app;
