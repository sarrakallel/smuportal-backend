const http = require('http');
const debug = require('debug')('node-angular');
const app = require('./app');

app.listen(3000, () => console.log('Server is up'));
