function calc(equation) {
  var eq;
  if (/=/.test(equation)) {
    eq="=";
  }
  expr1=equation.split(eq)[0];
  expr2=equation.slice(equation.indexOf(eq)+1);
  if (expr1[0]!="-"||expr1[0]!="+") {
    expr1="+"+expr1;
  }
  if (expr2[0]!="-"||expr2[0]!="+") {
    expr2="+"+expr2;
  }
  expr1=expr1.split(/(\-|\+)/);
  expr2=expr2.split(/(\-|\+)/);
  var tem1=[],tem2=[];
  for (var i=1;i<expr1.length;i+=2) {
    tem1.push(understand(expr1[i]+expr1[i+1]));
  }
  for (var i=1;i<expr2.length;i+=2) {
    tem2.push(understand(expr2[i]+expr2[i+1]));
  }
  console.log(tem1);
  console.log(tem2);
  var co=0,vari="x",nu=0;
  for (var i=0;i<tem1.length;i++) {
    if (tem1[i].va!=vari) {
      tem1[i].pos=!tem1[i].pos;
      tem2.push(tem1[i]);
      delete tem1[i];
    } else {
      if (tem1[i].pos) {
        co+=tem1[i].coeff;
      } else {
        co-=tem1[i].coeff;
      }
    }
  }
  for (var i=0;i<tem2.length;i++) {
    if (tem2[i].va==vari) {
      tem2[i].pos=!tem2[i].pos;
      tem1.push(tem2[i]);
      delete tem2[i];
    } else if (tem2[i].va===undefined) {
      if (tem2[i].pos) {
        nu+=tem2[i].coeff;
      } else {
        nu-=tem2[i].coeff;
      }
    }
  }
  return vari+eq+(nu/co);
}
function understand(term) {
  var ret={
    pos: term[0]=="+",
    exp: 1
  },vavi=term.slice(1,term.length).search(/\D/);
  if (vavi>-1) {
    ret.va=term[vavi+1];
    ret.coeff=term.slice(1,term.indexOf(ret.va));
    if (ret.coeff=="") {
      ret.coeff="1";
    }
    ret.coeff=Number(ret.coeff)
  } else {
    ret.coeff=Number(term.slice(1)); // not considering exponents
  }
  return ret;
}