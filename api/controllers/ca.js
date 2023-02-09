const Binance = require('node-binance-api');
const { changeAnalysis } = require('../helper/indicator');
const { regex, validate } = require('../utils/validation');

const binance = new Binance().options();

const calculateCA = async (req, res) => {
    const { asset } = req.params;
    const { tf } = req.query;

    if (!regex.test(asset)){
        throw new Error('Wrong Asset Name')
    }

    if ((!Array.isArray(tf)) || 
        (!tf.every(validate))){
            throw new Error('timeframe format is wrong');
    }

    const specialShiftTfs = {'12h': 2, '1d' : 3, '3d' : 7, '1w' : 15, '1M' : 61};

    const [oneMinuteTicks, twelveHoursTicks ] = await Promise.all([
           binance.candlesticks(asset, '1m'),
           binance.candlesticks(asset, '12h')
        ]);

    const len1 = oneMinuteTicks.length, len12 = twelveHoursTicks.length;

    const recentTick = oneMinuteTicks[len1 - 1];

    const data = {};
    let sum = 0;

    tf.forEach(val => {
        let i, shiftTick;
        
        if (!specialShiftTfs.hasOwnProperty(val)) {
            i = len1 - (+val);
            shiftTick = oneMinuteTicks[i];
        } 
        else  {
            i = len12 - specialShiftTfs[val];
            shiftTick = twelveHoursTicks[i];
        }
        // calculate the change analysis 
        const ca = changeAnalysis(recentTick[4], shiftTick[4]);

        sum+=ca;

        data[val] = ca;
    })

    data.average = sum/(tf.length);

    res.json({ data });
    res.end();
}

module.exports = { calculateCA };