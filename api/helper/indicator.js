const helkinAshi = (p, p1) => {
  const { open, close, high, low } = p;

  const prevOpen = +p1.open, prevClose = +p1.close;
  
  const hOpen = 0.5 * (prevOpen + prevClose);
  const hClose = 0.25 * (open + high + low + close);
  
  return { hOpen, hClose };
}
  
const momentum = (cp, pp) => cp - pp;

const changeAnalysis = (cp, pp) => {
  return ((cp - pp)/pp) * 100;
}

module.exports = { helkinAshi, momentum, changeAnalysis };