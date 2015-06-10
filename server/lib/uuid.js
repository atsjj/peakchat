module.exports = uuid;

function uuid() {
  var c = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');

  for (var u = '', i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      u += '-';
    } else if (i === 15) {
      u += '4';
    } else if (i === 20) {
      u += c[(Math.random() * 4 | 0 + 8)];
    } else {
      u += c[(Math.random() * 15 | 0)];
    }
  }

  return u;
}
