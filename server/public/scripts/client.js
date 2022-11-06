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

    $('#history').on('click', '.answer', clickHistory);
    $('#clearHistory').on('click', clearHistory);

    // load history
    render();
}

function backspace(){
    // undo one character
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
    // clears the expression.
    expressionToSend.num1 = '';
    expressionToSend.num2 = '';
    expressionToSend.operator = '';
    currentNumber = '';
    $('.operator').prop('disabled', false);
    $('input').val('');
}

function clickHistory(){
    console.log($(this).data('ans'));

    // evaluate expression again
    expressionToSend.num1 = String($(this).data('ans'));
    expressionToSend.num2 = '';
    expressionToSend.operator = '';
    currentNumber = String($(this).data('ans'));
    $('input').val(currentNumber);

}

function clearHistory(){
    $.ajax({
        url: '/expression',
        type: 'DELETE',
        success: function (result) {
            console.log('Successfully cleared history');
            render();
        }
    });
}

function addNumber() {
    // Add to current number
    currentNumber += $(this).text();
    if (expressionToSend.operator === ''){
        expressionToSend.num1 = currentNumber;
    } else {
        expressionToSend.num2 = currentNumber;
    }
    $('input').val(currentNumber);

}

function addDecimalPoint() {
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
    if ($(this).text() === '-' && currentNumber === ''){
        // Negative sign
        currentNumber = '-';
        $('input').val(currentNumber);
    } else if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        // if all fields are already filled out, then evaluate expression, 
        // reset expressionToSend, set num1 to result of evaluated expression,
        // and set operator to the selected operator.
        currentNumber = '';
        $('.operator').prop('disabled', true);
        evaluateExpression();
        expressionToSend.operator = $(this).text();
    } else if (expressionToSend.num1 !== ''){
        // Set operator
        currentNumber = '';
        $('.operator').prop('disabled', true);
        expressionToSend.operator = $(this).text();
    }
}

function getEvaluatedExpression(){
    $.ajax({
        method: 'GET',
        url: '/expression'
    }).then(function(response) {
        // reset expressionToSend 
        expressionToSend.num2 = '';
        $('.operator').prop('disabled', false);
        expressionToSend.operator = '';
        // set num1 and currentNumber to result of evaluated expression
        expressionToSend.num1 = response.num;
        currentNumber = String(response.num);
        // display answer on calculator screen
        $('input').val(response.num);
        // Call render
        render();
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

function render() {
    // Render to DOM.
    // GET the history array
    let history = [];
    $('#history').empty();
    $.ajax({
        method: 'GET',
        url: '/history'
    }).then(function(response) {
        // set history array to response
        history = response;
        for (let item of history){
            let num = item.slice(item.indexOf('=') + 2, item.length);
            $('#history').append(`
            <li class="answer" data-ans='${num}'>
                ${item}
            </li>
        `);
    }
    }).catch(function(error){
        alert('get history array failure', error);
    });

}