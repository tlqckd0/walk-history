'use strict';

const loaders = require('./loader');
const express = require('express');

async function startServer() {
    const PORT = process.env.PORT || 8080;
    const app = express();
    await loaders({ expressApp: app });

    app.listen(PORT, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Server start at ${PORT}`);
    });
}

startServer();
