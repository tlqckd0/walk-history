const { urlencoded } = require('express');
const express = require('express');
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use('/api/coords', require('./Coords'));

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
