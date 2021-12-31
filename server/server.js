require('dotenv').config();

function main() {
    const PORT = process.env.PORT || 8080;
    const app = require('./app');
    app.listen(PORT, () => {
        console.log('app start');
    });
}

main();
