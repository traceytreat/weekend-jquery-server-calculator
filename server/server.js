const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

let expression = [];