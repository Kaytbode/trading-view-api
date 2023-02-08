const { helkinAshi, momentum } = require('./indicator');

const calculateShift = arr => {
    let value;

    const isBelowThreshold = (currentValue) => currentValue < 0;
    const isAboveThreshold = (currentValue) => currentValue > 0;

    const negative = arr.every(isBelowThreshold);
    const positive = arr.every(isAboveThreshold);

    if (negative) value = -2;
    else if (positive) value = 2;
    else value = 0;

    return value;
};

const calculatePulseandShift = (pulse, shift)=> {
    let score = 0;

    if(pulse == 2 && shift == 2) {
        score = 3;
    }
    else if(pulse == 2 && shift == 0) {
        score = 2;
    }
    else if(pulse == 0 && shift == 2) {
        score = 1;
    }
    else if((pulse == 0 && shift == 0) 
           || (pulse == 2 && shift == -2)
           || (pulse == -2 && shift == 2)) {
        score = 0;
    }
    else if(pulse == 0 && shift == -2) {
        score = -1;
    }
    else if(pulse == -2 && shift == 0) {
        score = -2;
    }
    else if(pulse == -2 && shift == -2) {
        score = -3;
    }

    return score;
}

const calculateHAandMomentumOutput = (p, p1, p19) => {
    const { hOpen, hClose } = helkinAshi(p, p1);
    const mom = momentum(p[4], p19[4]);
  
    let output;
  
    if ((hClose > hOpen) && (mom > 0)) output = 2;
    
    else if (((hClose > hOpen) && (mom == 0)) || ((hClose < hOpen) && (mom > 0))) output = 1;

    else if (((hClose < hOpen) && (mom == 0)) || ((hClose > hOpen) && (mom < 0))) output = -1;
    
    else output = -2;
    
    return output;
}

module.exports = { calculatePulseandShift, calculateShift, calculateHAandMomentumOutput }