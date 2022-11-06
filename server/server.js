const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

// The object to be passed back to client.
let answer = {
    answerString: '',
    num: 0,
};

// The array for history of calculations.
let history = [];

// GET for /expression
app.get('/expression', (req, res) => {
    // Send the answer to the client
    res.send(answer);
});

// GET for /history
app.get('/history', (req, res) => {
    res.send(history);
});

// POST for /expression
app.post('/expression', (req, res) => {
    let expression = req.body;
    // properties of expression:
    // num1, num2, operator

    // Set answer to blank
    answer.answerString = '';
    answer.num = '';

    // Evaluate the expression
    // Check operator symbol
    if (expression.operator === '+'){
        answer.num = Number(expression.num1) + Number(expression.num2);
    } else if (expression.operator === '-'){
        answer.num = Number(expression.num1) - Number(expression.num2);
    } else if (expression.operator === '*'){ 
        answer.num = Number(expression.num1) * Number(expression.num2);
    } else if (expression.operator === '/'){
        answer.num = Number(expression.num1) / Number(expression.num2);
    } else {
        console.log('Error with calculation - this shouldn\'t happen');
    }

    // Make a string of the expression plus the answer. 
    // This is what is going to be displayed in the history list on the DOM.
    answer.answerString = expression.num1 + ' ' + expression.operator + ' ' + expression.num2 + ' = ' + answer.num;
    // Push answer to history array
    history.push(answer.answerString);
    res.sendStatus(201);
});

// DELETE for /expression
app.delete('/expression', (req, res) => {
    // Delete history (set history array to empty)
    history = [];
    res.sendStatus(201);

})

// The port where this is listening from. 
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
  })
  