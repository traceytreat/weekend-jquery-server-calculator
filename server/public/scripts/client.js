$(document).ready(onReady);

let currentOperation = '';
let currentNumber = '';
let expressionToSend = {
    num1: '',
    num2: '',
    operator: '',
};

function onReady() {
    $('.number').on('click', addNumber);
    $('.operator').on('click', setOperation);
    $('#equals').on('click', evaluateExpression);
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

function setOperation() {
    if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        // if all fields are already filled out, then evaluate expression, 
        // reset expressionToSend, set num1 to result of evaluated expression,
        // and set operator to the selected operator.
        //$('input').val('');
        currentNumber = '';
        evaluateExpression();
        expressionToSend.operator = $(this).text();
    } else if (expressionToSend.num1 !== '' && expressionToSend.operator === ''){
        // Set operator
        //$('input').val('');
        currentNumber = '';
        expressionToSend.operator = $(this).text();
    } else {
        //alert('Something is wrong with setting the operation');

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
        // set num1 to result of evaluated expression
        expressionToSend.num1 = response.num;
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
        <li class="answer">
            ${response.answerString}
        </li>
    `);
}