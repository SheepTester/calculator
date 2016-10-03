function calc(eq) {
  var elem=[["+",""]],mode="num",negativeYet=false,i; // call variables
  eq=eq.replace(/[ ]/gi,'');
  for (i=0;i<eq.length;i++) { // loop through each letter
    if (mode=="num") { // if we're dealing with normal stuff
      if (eq[i]=="(") { // if we're now dealing with parantheses
        negativeYet=false;
        mode=1; // to start collecting the parantheses's insides
        if (elem[elem.length-1][1]!=="") { // if the last item wasn't an empty string (aka it was a number)
          elem.push(["*",""]); // multiply (to allow 3(3))
        }
        elem[elem.length-1][1]="("; // create a "number" for parantheses
      } else if (["+","*","/","^","%",].includes(eq[i])) { // if the current character is an operator
        elem.push([eq[i],""]); // create new element with the operator
        negativeYet=false;
      } else if (eq[i]=="-"&&negativeYet) { // if we're dealing with a subtraction sign
        elem.push(["+","-"]); // new addition element starting with a negative
        if (eq[i]=="-"&&eq[i+1]=="-") {
          i++;
          elem[elem.length-1][1]="";
        }
      } else {
        elem[elem.length-1][1]+=eq[i]; // add to the current number
        if (!negativeYet) {
          negativeYet=true; // this prevents numbers like "-4-4" and detects a subtraction sign
        }
      }
    } else {
      if (eq[i]=="(") { // to detect inside parantheses
        mode++;
      } else if (eq[i]==")") {
        mode--;
      }
      elem[elem.length-1][1]+=eq[i]; // add to parantheses's insides
      if (mode<1) { // if the outermost parantheses just closed
        if (["+","*","/","^","%",].includes(eq[i+1])) { // the next character is an operation?
          elem.push([eq[i+1],""]);
        } else if (eq[i+1]=="-") { // subtraction is an exception
          elem.push(["+","-"]); // new addition element starting with a negative
          negativeYet=true;
          i++;
        } else {
          elem.push(["*",""]); // to allow (3)3
        }
        mode="num"; // continue along with the expression
      }
    }
  }
  
  elem.splice(0,0,["COMPLETELYFAKEOPERATOR","0"]); // so that everything starts with 0
  for (i=1;i<elem.length;i++) { // ROUND 1: PARANTHESES (and empty elements)
    if (elem[i][1]==="") { // was there a mistake and we forgot something?
      if (elem[i][0]=="+") {
        elem[i][1]=0; // it's safer to just change the value
      } else {
        elem[i][1]=1;
      }
    } else if (elem[i][1]=="-") { // did you mean to take the opposite of something?
      elem[i][1]=-1;
    } else if (elem[i][1][0]=="(") { // fyi, this checks if the first letter of the number element of element i of the array elem is a parantheses
      if (elem[i][1][elem[i][1].length-1]==")") { // in case the user didn't end the expression with a )
        elem[i][1]=calc(elem[i][1].slice(1,-1)); // recursion is dangerous; do not try at home
      } else {
        elem[i][1]=calc(elem[i][1].slice(1));
      }
      switch(elem[i-1][1]) { // for functions such as abs()
        case "abs":
          elem[i-1][1]=Math.abs(Number(elem[i][1]));
          elem.splice(i,1);i--; // remove the element
          break;
        case "sin":
          elem[i-1][1]=Math.sin(Number(elem[i][1])*(Math.PI/180));
          elem.splice(i,1);i--;
          break;
        case "cos":
          elem[i-1][1]=Math.cos(Number(elem[i][1])*(Math.PI/180));
          elem.splice(i,1);i--;
          break;
        case "tan":
          elem[i-1][1]=Math.tan(Number(elem[i][1])*(Math.PI/180));
          elem.splice(i,1);i--;
          break;
        /*case "asin":
          elem[i-1][1]=Math.asin(Number(elem[i][1])*(Math.PI/180));
          elem.splice(i,1);i--;
          break;*/
        case "ceil":
          elem[i-1][1]=Math.ceil(Number(elem[i][1]));
          elem.splice(i,1);i--;
          break;
        case "floor":
          elem[i-1][1]=Math.floor(Number(elem[i][1]));
          elem.splice(i,1);i--;
          break;
        case "round":
          elem[i-1][1]=Math.round(Number(elem[i][1]));
          elem.splice(i,1);i--;
          break;
        case "log":
          elem[i-1][1]=Math.log(Number(elem[i][1]));
          elem.splice(i,1);i--;
          break;
        case "sqrt":
          elem[i-1][1]=Math.sqrt(Number(elem[i][1]));
          elem.splice(i,1);i--;
          break;
      }
    } else {
      switch(elem[i][1]) {
        case "e":
          elem[i][1]=Math.E;
          break;
        case "pi":
          elem[i][1]=Math.PI;
          break;
      }
    }
  }
  for (i=elem.length-1;i>0;i--) { // ROUND 2: EXPONENTS (notice how we're going backwards since exponents go from right to left)
    if (elem[i][0]=="^") { // is the operator an exponent?
      elem[i-1][1]=Math.pow(Number(elem[i-1][1]),Number(elem[i][1])); // the actual math happens here
      elem.splice(i,1); // remove the element
    }
  }
  for (i=1;i<elem.length;i++) { // ROUND 3: MULTIPLICATION AND DIVISION AND MODULUS
    if (elem[i][0]=="*") { // is the operator * or / or %?
      elem[i-1][1]=Number(elem[i-1][1])*Number(elem[i][1]); // basically the same for all of these
      elem.splice(i,1);
      i--;
    } else if (elem[i][0]=="/") {
      elem[i-1][1]=Number(elem[i-1][1])/Number(elem[i][1]);
      elem.splice(i,1);
      i--;
    } else if (elem[i][0]=="%") {
      elem[i-1][1]=Number(elem[i-1][1])%Number(elem[i][1]);
      elem.splice(i,1);
      i--;
    }
  }
  for (i=1;i<elem.length;i++) { // ROUND 4: ADDITION (and subtraction)
    if (elem[i][0]=="+") { // is the operator addition?
      elem[i-1][1]=Number(elem[i-1][1])+Number(elem[i][1]);
      elem.splice(i,1);
      i--;
    }
  }
  return elem[0][1]; // the remains of the expression
}