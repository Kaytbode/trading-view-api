const helkinAshi = (p, p1) => {
  const open = +p[1], max = +p[2], min = +p[3], close = +p[4];

  const prevOpen = +p1[1], prevClose = +p1[4];
  
  const hOpen = 0.5 * (prevOpen + prevClose);
  const hClose = 0.25 * (open + max + min + close);
  
  return { hOpen, hClose };
}
  
const momentum = (cp, pp) => cp - pp;

const changeAnalysis = (cp, pp) => {
  return ((cp - pp)/pp) * 100;
}

module.exports = { helkinAshi, momentum, changeAnalysis };