const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const compositionRoutes = require('./composition-routes');

const pathToDist = path.join(__dirname, '../dist');
const pathToIndex = path.join(pathToDist, 'index.html');
const defaultNodeServerPort = 5000;

app.set('port', process.env.PORT || defaultNodeServerPort);
app.use(bodyParser.json());
app.use(express.static(pathToDist));

app.get('/', (req, res) => {
    res.sendFile(pathToIndex);
});

app.use(compositionRoutes);

app.get('/*', (req, res) => {
    res.sendFile(pathToIndex);
});

app.listen(app.get('port'), () => {
    console.log(`listening on port: ${ app.get('port') }`);
});
