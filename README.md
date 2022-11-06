# jQuery Server Calculator

## Description

This project functions as a basic calculator with add, subtract, multiply, and divide operations.

The calculations are done in the server. A history of all calculations is also saved in the server.

It's supposed to simulate a real calculator with buttons so no keyboard input-- just click the buttons.

### Prerequisites

You need:
- node.js
- express

### Installation
1. Clone the repo
2. Open terminal and navigate to the cloned repo
3. Run npm init --yes
4. Run npm install express

### Usage
1. To start server, run npm start
2. Visit localhost:5000 in your browser
3. Click the buttons on the calculator
4. To evaluate expression, click the = button
5. Clicked the wrong number? Click the < arrow to backspace
6. Click the C button to clear the current expression
7. Click on any expression in the history to calculate it again
8. Clear the history by clicking Clear History
9. When you're finished, close the server with Ctrl + C in the terminal

You can hover over each button for a description in english (i.e. hovering over the 7 button should show "Seven")

### Known issues
There may be issues with accuracy when performing operations on decimals (i.e. 1.4 minus 1 shows up as 0.399999999999 when it should be 0.4)

This is a known issue with how computers store decimal numbers.

There are libraries that fix this problem but I decided to leave it as-is for now

### Acknowledgment
Thanks Prime and Shawl!
