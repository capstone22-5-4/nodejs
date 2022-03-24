var express = require('express');
var app = express();
const PORT = 8880;

app.use(require('./routkp'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});