function evaluate(expr, vars = {}) {
  function getVar(varname) {
    return vars[varname] === undefined ? 0 : +vars[varname];
  }
  const numerals = "0123456789.",
  alphabeticals = "abcdefghijklmnopqrstuvwxyz",
  operators = "+*/%^",
  actualOperators = ["+", "*", "^", "/", "%"];
  let mode = "number",
  items = [""],
  parenthesesDepth = 0,
  evals = [];
  for (let i = 0; i < expr.length; i++) {
    if (parenthesesDepth > 0) {
      items[items.length - 1] += expr[i];
      if (expr[i] === "(") parenthesesDepth++;
      else if (expr[i] === ")") parenthesesDepth--;
    } else if (expr[i] === "-") {
      if (items[items.length - 1] === "-") {
        items[items.length - 1] = "-1";
        items.push("*");
        items.push("-");
      } else {
        switch (mode) {
          case "number":
          case "variable":
          case "parens":
            items.push("+");
            items.push("-");
            mode = "number";
            break;
          case "operator":
            items.push("-");
            mode = "number";
            break;
        }
      }
    } else if (expr[i] === "(") {
      if (mode !== "variable" && items[items.length - 1] !== "-") {
        if (items[items.length - 1] !== "") {
          if (mode === "number" || mode === "parens") items.push("*");
        }
        items.push("");
      }
      parenthesesDepth++;
      items[items.length - 1] += expr[i];
      mode = "parens";
    } else if (numerals.includes(expr[i])) {
      if (mode !== "number") {
        if (mode === "variable" || mode === "parens") items.push("*");
        items.push("");
        mode = "number";
      }
      items[items.length - 1] += expr[i];
    } else if (operators.includes(expr[i])) {
      if (mode !== "operator") {
        if (items[items.length - 1] !== "") {
          if (items[items.length - 1] === "-") {
            items[items.length - 1] = "0";
          } else if (mode === "number") {
            if (items[items.length - 1][0] === "-" && expr[i] !== "+") {
              items[items.length - 1] = items[items.length - 1].slice(1);
              items.splice(-1, 0, "-1");
              items.splice(-1, 0, "*");
            }
          }
          items.push("");
        }
        mode = "operator";
      }
      items[items.length - 1] += expr[i];
    } else if (alphabeticals.includes(expr[i])) {
      if (mode !== "variable") {
        if (items[items.length - 1] !== "") {
          if (items[items.length - 1] === "-") {
            items[items.length - 1] = "-1";
            items.push("*");
          } else if (mode === "number" || mode === "parens") items.push("*");
          items.push("");
        }
        mode = "variable";
      }
      items[items.length - 1] += expr[i];
    }
  }
  if (parenthesesDepth > 0) items[items.length - 1] += ")".repeat(parenthesesDepth);
  for (let i = 0; i < items.length; i++) {
    if (items[i] === "") items[i] = 0;
    else if (!/[^*^/%+]/.test(items[i])) {
      if (items[i] === "**") items[i] = "^";
      else if (!actualOperators.includes(items[i])) items[i] = "+";
    } else if (!/[^0-9.-]/.test(items[i])) {
      items[i] = +items[i];
    } else if (!/[^a-z]/.test(items[i])) {
      let val = 1;
      for (let j = 0; j < items[i].length; j++) val *= getVar(items[i][j]);
      items[i] = val;
    } else evals.push(i);
  }
  for (let i = 0; i < evals.length; i++) {
    let evalString = items[evals[i]],
    val = evaluate(evalString.slice(evalString.indexOf("(") + 1, evalString.lastIndexOf(")")));
    if (evalString[0] !== "(") {
      let fnName = evalString.slice(0, evalString.indexOf("("));
      switch (fnName) {
        case "-":
          val *= -1;
          break;
        case "sqrt":
          val = Math.sqrt(val);
          break;
        case "abs":
          val = Math.abs(val);
          break;
        default:
          for (let j = 0; j < fnName.length; j++) val *= getVar(fnName[j]);
      }
    }
    items[evals[i]] = val;
  }
  for (let i = items.length; i--;) { // RTL eval order
    if (items[i] === "^") {
      items[i] = Math.pow(items[i - 1] !== undefined ? items[i - 1] : 1 || 1, items[i + 1] || 0);
      items.splice(i + 1, 1);
      if (i >= 0) items.splice(i - 1, 1);
      i--;
    }
  }
  for (let i = 0; i < items.length; i++) {
    let defaultHappened = false;
    switch (items[i]) {
      case "*":
        items[i] = (items[i - 1] !== undefined ? items[i - 1] : 1)
          * (items[i + 1] !== undefined ? items[i + 1] : 1);
        break;
      case "/":
        items[i] = (items[i - 1] !== undefined ? items[i - 1] : 1)
          / (items[i + 1] !== undefined ? items[i + 1] : 1);
        break;
      case "%":
        items[i] = (items[i - 1] !== undefined ? items[i - 1] : 1)
          % (items[i + 1] !== undefined ? items[i + 1] : 1);
        break;
      default:
        defaultHappened = true;
    }
    if (!defaultHappened) {
      items.splice(i + 1, 1);
      if (i >= 0) items.splice(i - 1, 1);
      i--;
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i] === "+") {
      items[i] = (items[i - 1] || 0) + (items[i + 1] || 0);
      items.splice(i + 1, 1);
      if (i > 0) items.splice(i - 1, 1);
      i--;
    }
  }
  if (items.length === 0) return 0;
  return items[0];
}
