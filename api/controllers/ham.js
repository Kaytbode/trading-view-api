const Binance = require('node-binance-api');
const {  calculateHAandMomentumOutput } = require('../helper/pulseshift');
const { regex, validate } = require('../utils/validation');

const binance = new Binance().options();

const calculateHAM = async (req, res) => {
    const { asset } = req.params;
    const { tf } = req.query;

    if (!regex.test(asset)){
        throw new Error('Wrong Asset Name')
    }

    if ((!Array.isArray(tf)) || 
        (!tf.every(validate))){
        throw new Error('timeframe format is wrong');
    }

    const [oneMinuteTicks, thirtyMinutesTicks,
           twelveHoursTicks, oneWeekTicks ] = await Promise.all([
              binance.candlesticks(asset, '1m'),
              binance.candlesticks(asset, '30m'),
              binance.candlesticks(asset, '12h'),
              binance.candlesticks(asset, '1w')
           ]);

    const recentTick = oneMinuteTicks[oneMinuteTicks.length - 1];

       console.log(oneMinuteTicks[499]);
       console.log(thirtyMinutesTicks[499]);
       console.log(twelveHoursTicks[499]);
       console.log(oneWeekTicks[499]);

    const data = {price: recentTick[4]};

    tf.forEach(val => {
      let ticks, divisor;
      val = +val;

      if (val >= 1 && val <= 25) {
          ticks = oneMinuteTicks;
          divisor = 1;
      }
      else if (val >= 30 && val <= 600 ) {
          ticks = thirtyMinutesTicks;
          divisor = 30
      }
      else if (val >= 720 && val <= 8640){
          ticks = twelveHoursTicks;
          divisor = 720;
      } 
      else if (val >= 10080 && val <= 241920) {
          ticks = oneWeekTicks;
          divisor = 10080;
      }
      else {
          throw new Error('timeframe not supported');
      }

      const i1 = 500 - ((val/divisor) * 2);
      const i19 = 500 - ((val/divisor) * 20);

      const output = calculateHAandMomentumOutput(recentTick, ticks[i1], ticks[i19]);

      data[val] = output;
    });

    res.json({ data });
    res.end();
}

module.exports = { calculateHAM };