$(function () {
  let currentInput = '';
  let operatorPressed = false;

  // Update the displays: expression on top, main display below
  function updateDisplay() {
    if (currentInput === '') {
      $('#expression').text('');
      $('#display').val('0');
    } else {
      $('#expression').text(currentInput);
      $('#display').val(''); // Clear main display until calculation
    }
  }

  // Append a number (digit)
  function appendNumber(num) {
    if (operatorPressed) operatorPressed = false;
    currentInput += num;
    updateDisplay();
  }

  // Append a dot
  function appendDot() {
    if (!currentInput || operatorPressed) {
      currentInput += '0.';
      operatorPressed = false;
    } else {
      // prevent multiple dots in last number
      let parts = currentInput.split(/[\+\-\*\/]/);
      let lastPart = parts[parts.length - 1];
      if (!lastPart.includes('.')) {
        currentInput += '.';
      }
    }
    updateDisplay();
  }

  // Append operator
  function appendOperator(op) {
    if (currentInput === '') return;
    if (operatorPressed) {
      // Replace last operator with new
      currentInput = currentInput.slice(0, -1) + op;
    } else {
      currentInput += op;
      operatorPressed = true;
    }
    updateDisplay();
  }

  // Clear all
  function clearDisplay() {
    currentInput = '';
    operatorPressed = false;
    $('#display').val('0');
    $('#expression').text('');
  }

  // Backspace last character
  function backspace() {
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  }

  // Toggle sign of last number
  function toggleSign() {
    if (!currentInput) return;

    let parts = currentInput.split(/([\+\-\*\/])/);
    let last = parts.pop();
    if (!last) return;

    if (last.startsWith('-')) {
      last = last.slice(1);
    } else {
      last = '-' + last;
    }
    parts.push(last);
    currentInput = parts.join('');
    updateDisplay();
  }

  // Square root of last number
  function squareRoot() {
    try {
      let parts = currentInput.split(/[\+\-\*\/]/);
      let lastNum = parts.pop();
      if (!lastNum) return;
      let sqrtValue = Math.sqrt(parseFloat(lastNum));
      if (isNaN(sqrtValue)) return;

      let rest = currentInput.slice(0, currentInput.length - lastNum.length);
      currentInput = rest + sqrtValue;
      updateDisplay();
    } catch {
      // ignore errors
    }
  }

  // Calculate final result and show in main display, keep expression on top
  function calculate() {
    try {
      if (!currentInput) return;
      // Replace any '×' or '÷' with JS operators
      let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
      let result = eval(expression);
      if (result === undefined) return;
      // Show result in main display, keep expression above
      $('#display').val(result);
      // Do NOT clear expression so user sees full input
      operatorPressed = false;
    } catch {
      alert('Invalid Expression');
      clearDisplay();
    }
  }

  // Button click events
  $('.num').click(function () {
    appendNumber($(this).text());
  });

  $('#dot').click(function () {
    appendDot();
  });

  $('.operator').click(function () {
    appendOperator($(this).data('op'));
  });

  $('#clear').click(function () {
    clearDisplay();
  });

  $('#backspace').click(function () {
    backspace();
  });

  $('#sign').click(function () {
    toggleSign();
  });

  $('#sqrt').click(function () {
    squareRoot();
  });

  $('#equals').click(function () {
    calculate();
  });

  // Initialize
  clearDisplay();
});
