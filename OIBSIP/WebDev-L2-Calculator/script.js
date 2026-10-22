const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

let expression = "";

function updateDisplay() {
  expressionDisplay.textContent = expression || "0";
}

function showError(message) {
  resultDisplay.textContent = message;
  resultDisplay.classList.add("error");
  expression = "";
  expressionDisplay.textContent = "0";
}

function clearErrorState() {
  resultDisplay.classList.remove("error");
}

function addNumber(number) {
  clearErrorState();

  if (expression === "0") {
    expression = number === "." ? "0." : number;
    updateDisplay();
    return;
  }

  const lastCharacter = expression.slice(-1);

  if (number === "." && lastCharacter === ".") {
    return;
  }

  const lastNumber = expression.split(/[+\-×÷]/).pop();

  if (number === "." && lastNumber.includes(".")) {
    return;
  }

  if ("+−×÷".includes(lastCharacter) && number === ".") {
    expression += "0.";
  } else {
    expression += number;
  }

  updateDisplay();
}

function addOperator(operator) {
  clearErrorState();

  if (expression === "") {
    if (operator === "-") {
      expression = "-";
    }
    updateDisplay();
    return;
  }

  const lastCharacter = expression.slice(-1);

  if ("+−×÷".includes(lastCharacter)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  updateDisplay();
}

function calculate(a, operator, b) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      if (b === 0) {
        return null;
      }
      return a / b;
    default:
      return null;
  }
}

function evaluateExpression(input) {
  const tokens = input.match(/(\d+\.?\d*)|([+\-×÷])/g);

  if (!tokens) {
    return null;
  }

  const firstPass = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === "×" || token === "÷") {
      const previousValue = parseFloat(firstPass.pop());
      const nextValue = parseFloat(tokens[i + 1]);

      if (Number.isNaN(previousValue) || Number.isNaN(nextValue)) {
        return null;
      }

      const result = calculate(previousValue, token, nextValue);

      if (result === null) {
        return "DIVISION_BY_ZERO";
      }

      firstPass.push(result.toString());
      i++;
    } else {
      firstPass.push(token);
    }
  }

  let finalResult = parseFloat(firstPass[0]);

  for (let i = 1; i < firstPass.length; i += 2) {
    const operator = firstPass[i];
    const nextValue = parseFloat(firstPass[i + 1]);

    if (Number.isNaN(finalResult) || Number.isNaN(nextValue)) {
      return null;
    }

    const result = calculate(finalResult, operator, nextValue);

    if (result === null) {
      return "DIVISION_BY_ZERO";
    }

    finalResult = result;
  }

  return finalResult;
}

function showResult() {
  clearErrorState();

  if (expression === "") {
    return;
  }

  const lastCharacter = expression.slice(-1);

  if ("+−×÷".includes(lastCharacter)) {
    expression = expression.slice(0, -1);
  }

  const output = evaluateExpression(expression);

  if (output === "DIVISION_BY_ZERO") {
    showError("Cannot divide by zero");
    return;
  }

  if (output === null || Number.isNaN(output) || !Number.isFinite(output)) {
    showError("Invalid expression");
    return;
  }

  resultDisplay.textContent = Number(output.toFixed(10)).toString();
  expression = Number(output.toFixed(10)).toString();
  expressionDisplay.textContent = expression;
}

function deleteLastCharacter() {
  clearErrorState();
  expression = expression.slice(0, -1);
  updateDisplay();
}

function clearCalculator() {
  expression = "";
  clearErrorState();
  expressionDisplay.textContent = "0";
  resultDisplay.textContent = "0";
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    if (number !== undefined) {
      addNumber(number);
    } else if (operator !== undefined) {
      addOperator(operator);
    } else if (action === "equals") {
      showResult();
    } else if (action === "clear") {
      clearCalculator();
    } else if (action === "delete") {
      deleteLastCharacter();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    addNumber(key);
  } else if (key === ".") {
    addNumber(".");
  } else if (key === "+") {
    addOperator("+");
  } else if (key === "-") {
    addOperator("-");
  } else if (key === "*") {
    addOperator("×");
  } else if (key === "/") {
    event.preventDefault();
    addOperator("÷");
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    showResult();
  } else if (key === "Backspace") {
    deleteLastCharacter();
  } else if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();