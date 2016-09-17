function calc(equation,data) { // define new function
  var eq,data; // declare the existence of eq and data (so that the second parameter is optional)
  if (/=/.test(equation)) { // is there an equal sign?
    eq="="; // if so, the comparision symbol is =
  } else if (/>/.test(equation)) { // repeat for < and >
    eq=">";
  } else if (/</.test(equation)) {
    eq="<";
  } else { // otherwise
    eq=""; // this means it's just a mere expression
  }
  if (eq!="") { // if it's not an expression
    var expr1=equation.split(eq)[0]; // the first part of the equation
    var expr2=equation.slice(equation.indexOf(eq)+1); // second part
    if (expr1[0]!="-"||expr1[0]!="+") { // if the first term doesn't have a pos/neg sign
      expr1="+"+expr1; // add the positive sign
    }
    if (expr2[0]!="-"||expr2[0]!="+") { // repeat for expr2
      expr2="+"+expr2;
    }
    expr1=expr1.split(/(\-|\+)/); // split into terms
    expr2=expr2.split(/(\-|\+)/); // repeat
    var tem1=[],tem2=[]; // declare the lists of terms
    for (var i=1;i<expr1.length;i+=2) { // loop through the list of terms to get the data
      tem1.push(understand(expr1[i]+expr1[i+1])); // as shown here
    }
    for (var i=1;i<expr2.length;i+=2) { // repeat for expr2
      tem2.push(understand(expr2[i]+expr2[i+1]));
    }
    console.log(tem1); // for dev purposes
    console.log(tem2);
    var co=0,vari="x",nu=0; // combining like terms now
    for (var i=0;i<tem1.length;i++) { // for the first expression, for multiples of x
      if (tem1[i].va!=vari) { // if it's just a number, subtract from both sides
        tem1[i].pos=!tem1[i].pos; // invert positivity
        tem2.push(tem1[i]); // add to other list
        delete tem1[i]; // doesn't exist in this list anymore
      } else { // otherwise
        if (tem1[i].pos) { // add or subtract from the total coefficients (for combining like terms)
          co+=tem1[i].coeff;
        } else {
          co-=tem1[i].coeff;
        }
      }
    }
    for (var i=0;i<tem2.length;i++) { // repeat
      if (tem2[i].va==vari) {
        tem2[i].pos=!tem2[i].pos;
        tem1.push(tem2[i]);
        delete tem2[i];
      } else if (tem2[i].va===undefined) { // in case there's another variable
        if (tem2[i].pos) {
          nu+=tem2[i].coeff;
        } else {
          nu-=tem2[i].coeff;
        }
      }
    }
    if (co<0&&eq!="=") { // if we're dealing with inequalities and we're dividing both sides by a negative number
      eq=eq=="<"?">":"<"; // flip it
    }
    if (nu/co===NaN) { // NaN is what happens when the statement becomes true without the need of X
      return "All real numbers work.";
    } else if (nu/co===Infinity) { // Infinity is what happens when the statement becomes false without the need of X
      return "No solution";
    } else {
      return vari+eq+(nu/co); // this is what you get
    }
  } else {
    /* WIP */
  }
}
function understand(term) { // now for getting the juice out of a term
  var ret={ // this is what will soon be returned
    pos: term[0]=="+", // if the term starts with + or not
    exp: 1 // not used
  },vavi=term.slice(1,term.length).search(/\D/); // getVar
  if (vavi>-1) { // if a var exists
    ret.va=term[vavi+1]; // get the actual var name
    ret.coeff=term.slice(1,term.indexOf(ret.va)); // get the coefficient
    if (ret.coeff=="") { // no coefficient? no prob
      ret.coeff="1"; // just return 1
    }
    ret.coeff=Number(ret.coeff); // and we now have a coefficient in the system
  } else {
    ret.coeff=Number(term.slice(1)); // get the rest of the number excluding the pos/neg sign; not considering exponents
  }
  return ret; // return the newly made term data
}
