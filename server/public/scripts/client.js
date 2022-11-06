$(document).ready(onReady);

let currentNumber = '';
let expressionToSend = {
    num1: '',
    num2: '',
    operator: '',
};

function onReady() {
    $('.number').on('click', addNumber);
    $('.operator').on('click', setOperation);
    $('#decimalpoint').on('click', addDecimalPoint);
    $('#backspace').on('click', backspace);
    $('#clear').on('click', clear);
    $('#equals').on('click', evaluateExpression);
}

function backspace(){
    if (currentNumber.length === 0 || currentNumber.length === 1){
        currentNumber = '';
    } else {
        currentNumber = currentNumber.slice(0, currentNumber.length - 1);
    }
    if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        expressionToSend.num2 = currentNumber;
    } else {
        expressionToSend.num1 = currentNumber;
    }
    $('input').val(currentNumber);
}

function clear(){
    expressionToSend.num1 = '';
    expressionToSend.num2 = '';
    expressionToSend.operator = '';
    currentNumber = '';
    $('input').val('');
}

function addNumber() {
    // Add to current number
    currentNumber += $(this).text();
    if (expressionToSend.operator == ''){
        console.log('adding to num1');
        expressionToSend.num1 = currentNumber;
    } else {
        console.log('adding to num2');
        expressionToSend.num2 = currentNumber;
    }
    $('input').val(currentNumber);
    console.log(currentNumber);

}

function addDecimalPoint() {
    console.log('add decimal point');
    // check if string is empty
    if (currentNumber === ''){
        currentNumber += '0.';
    } else if (currentNumber.charAt(currentNumber.length - 1) !== '.'){
        // add decimal point
        currentNumber += '.';
    }
    // otherwise do nothing.
    // set input value to current number
    $('input').val(currentNumber);
}

function setOperation() {
    if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        // if all fields are already filled out, then evaluate expression, 
        // reset expressionToSend, set num1 to result of evaluated expression,
        // and set operator to the selected operator.
        //$('input').val('');
        currentNumber = '';
        evaluateExpression();
        expressionToSend.operator = $(this).text();
    } else if (expressionToSend.num1 !== ''){
        // Set operator
        //$('input').val('');
        currentNumber = '';
        expressionToSend.operator = $(this).text();
    } 
    console.log('num1', expressionToSend.num1);
    console.log('num2', expressionToSend.num2);
    console.log('operator', expressionToSend.operator);
}

function getEvaluatedExpression(){
    $.ajax({
        method: 'GET',
        url: '/expression'
    }).then(function(response) {
        // reset expressionToSend 
        expressionToSend.num2 = '';
        expressionToSend.operator = '';
        // set num1 and currentNumber to result of evaluated expression
        expressionToSend.num1 = response.num;
        currentNumber = String(response.num);
        // display answer on calculator screen
        $('input').val(response.num);
        // Call render
        render(response);
    }).catch(function(error){
        alert('getEvaluatedExpression failure', error);
    });
}

function evaluateExpression() {
    // check if all fields are filled in
    if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        // POST the expression to the server.
        $.ajax({
            method: 'POST',
            url: '/expression', 
            data: expressionToSend,
          }).then(function(response) {
              // GET the evaluated expression from the server.
              getEvaluatedExpression();
          }).catch(function(response) {
              alert('evaluateExpression failed');
          });
    }

}

function render(response) {
    // Render to DOM.
    $('#history').append(`
        <li class="answer" data-num="${response.num}">
            ${response.answerString}
        </li>
    `);
}