$(document).ready(onReady);

// This string is for tracking the current value (the one currently displayed on the calculator screen)
let currentNumber = '';

// This object will be sent to the server.
let expressionToSend = {
    num1: '',
    num2: '',
    operator: '',
};

function onReady() {
    // Setting the buttons
    $('.number').on('click', addNumber);
    $('.operator').on('click', setOperation);
    $('#decimalpoint').on('click', addDecimalPoint);
    $('#backspace').on('click', backspace);
    $('#clear').on('click', clear);
    $('#equals').on('click', evaluateExpression);

    $('#history').on('click', '.answer', clickHistory);
    $('#clearHistory').on('click', clearHistory);

    // On page load, display history
    render();
}

function backspace(){
    // Undo one character
    // Base case: if currentNumber is empty or only has one character,
    // we can just set it to an empty string. No need to do anything fancy
    if (currentNumber.length === 0 || currentNumber.length === 1){
        currentNumber = '';
    } else {
        // Otherwise we subtract the last digit.
        currentNumber = currentNumber.slice(0, currentNumber.length - 1);
    }
    // Update num1 or num2 to reflect the change.
    if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        expressionToSend.num2 = currentNumber;
    } else {
        expressionToSend.num1 = currentNumber;
    }
    // Update the display on the calculator.
    $('input').val(currentNumber);
}

function clear(){
    // Clears the whole expression and display.
    expressionToSend.num1 = '';
    expressionToSend.num2 = '';
    expressionToSend.operator = '';
    currentNumber = '';
    $('.operator').prop('disabled', false);
    $('input').val('');
}

function clickHistory(){
    // "Evaluate" the expression again
    // Really we're just taking the answer (that has been conveniently stored as data in the list item)
    // setting num1 = the answer, and displaying it on the calculator screen.
    expressionToSend.num1 = String($(this).data('ans'));
    expressionToSend.num2 = '';
    expressionToSend.operator = '';
    currentNumber = String($(this).data('ans'));
    // Set calculator display
    $('input').val(currentNumber);

}

function clearHistory(){
    // DELETE for clearing the history
    $.ajax({
        url: '/expression',
        type: 'DELETE',
        success: function (result) {
            // Call render after it's done
            render();
        }
    });
}

function addNumber() {
    // Add to current number
    currentNumber += $(this).text();
    // Setting either num1 or num2 depending on whether an operator has been set or not
    if (expressionToSend.operator === ''){
        expressionToSend.num1 = currentNumber;
    } else {
        expressionToSend.num2 = currentNumber;
    }
    // Set calculator display
    $('input').val(currentNumber);

}

function addDecimalPoint() {
    // Check if string is empty
    if (currentNumber === ''){
        currentNumber += '0.';
    } else if (!currentNumber.includes('.')){
        // Add decimal point
        currentNumber += '.';
    }
    // otherwise do nothing.
    // set input value to current number
    $('input').val(currentNumber);
}

function setOperation() {
    // The subtract button also functions as a negative sign. I check for that first
    if ($(this).text() === '-' && currentNumber === ''){
        // Add negative sign
        currentNumber = '-';
        $('input').val(currentNumber);
    } else if (expressionToSend.num1 !== '' && expressionToSend.num2 !== '' && expressionToSend.operator !== ''){
        // If all fields are already filled out, then go ahead with evaluating the expression.
        currentNumber = '';
        $('.operator').prop('disabled', true);
        evaluateExpression();
        // Expression has been evaluated and the answer has been set to num1.
        // Now we can set the operator.
        expressionToSend.operator = $(this).text();
    } else if (expressionToSend.num1 !== ''){
        // Set operator.
        currentNumber = '';
        $('.operator').prop('disabled', true);
        expressionToSend.operator = $(this).text();
    }
}

function getEvaluatedExpression(){
    // GET the evaluated expression from the server.
    $.ajax({
        method: 'GET',
        url: '/expression'
    }).then(function(response) {
        // Reset expressionToSend 
        expressionToSend.num2 = '';
        expressionToSend.operator = '';
        // Enable operator buttons again.
        $('.operator').prop('disabled', false);
        // Set num1 and currentNumber to result of evaluated expression
        expressionToSend.num1 = response.num;
        currentNumber = String(response.num);
        // Display answer on calculator screen
        $('input').val(response.num);
        // Call render
        render();
    }).catch(function(error){
        alert('getEvaluatedExpression failure', error);
    });
}

function evaluateExpression() {
    // First check if all fields are filled in.
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
        // Set history array to response
        history = response;
        // Loop through history array
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