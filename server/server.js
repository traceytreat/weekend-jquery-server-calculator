const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

let answer = {
    answerString: '',
    num: 0,
};

let history = [];

// GET for /expression
app.get('/expression', (req, res) => {
    // send the answer to the client
    res.send(answer);
});

app.get('/history', (req, res) => {
    res.send(history);
});

app.post('/expression', (req, res) => {
    console.log('in post expression');
    let expression = req.body;
    // properties of expression:
    // num1, num2, operator

    // set answer to blank
    answer.answerString = '';
    answer.num = '';

    // evaluate the expression
    console.log('the operator',expression.operator);
    if (expression.operator === '+'){
        console.log('adding');
        answer.num = Number(expression.num1) + Number(expression.num2);
    } else if (expression.operator === '-'){
        console.log('subtracting');
        answer.num = Number(expression.num1) - Number(expression.num2);
    } else if (expression.operator === '*'){ 
        console.log('multiplying');
        answer.num = Number(expression.num1) * Number(expression.num2);
    } else if (expression.operator === '/'){
        console.log('dividing');
        answer.num = Number(expression.num1) / Number(expression.num2);
    } else {
        console.log('Error with calculation - this shouldn\'t happen');
    }
    answer.answerString = expression.num1 + ' ' + expression.operator + ' ' + expression.num2 + ' = ' + answer.num;
    // push answer to history
    history.push(answer.answerString);
    res.sendStatus(201);
});

app.delete('/expression', (req, res) => {
    history = [];
    res.sendStatus(201);

})

//The port where this is listening from. 
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
  })
  