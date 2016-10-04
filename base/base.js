function base(num,base1,base2) {
  digits='0123456789abcdefghijklmnopqrstuvwxyz'.split('');
  base1=Number(base1);
  base2=Number(base2);
  if (base1<2) base1=2;
  if (base1>36) base1=36;
  if (base2<2) base2=2;
  if (base2>36) base2=36;
  var newnum=0,decimalOffset=num.indexOf(".")>-1?num.indexOf("."):0,neg=num[0]=="-";
  if (neg) num=num.slice(1);
  if (base1==10) {
    newnum=Number(num);
  } else {
    //i=
    for (var i=0;i<num.length;i++) {
      if (num[num.length-1-i]==".") {
        i++;
        decimalOffset++;
      }
      newnum+=digits.indexOf(num[num.length-1-i])*Math.pow(base1,i-decimalOffset);
    }
  }
  if (base2!=10) {
    var tempnum=newnum;
    newnum="";
    console.log(decimalOffset);
    while (tempnum!==0) {
      newnum=digits[tempnum%base2]+newnum;
      tempnum=Math.floor(tempnum/base2);
    }
  }
  return (neg?"-":"")+newnum;
}