const Binance = require('binance-api-node').default;
const { changeAnalysis } = require('../helper/indicator');
const { regex, validate } = require('../utils/validation');

const binance = Binance();

const calculateCA = async (req, res) => {
    let { asset } = req.params;
    const { tf } = req.query;

    asset = asset.toUpperCase();

    if (!regex.test(asset)){
        throw new Error('Wrong Asset Name')
    }

    if ((!Array.isArray(tf)) || 
        (!tf.every(validate))){
            throw new Error('timeframe format is wrong');
    }

    const specialShiftTfs = {'12h': 2, '1d' : 3, '3d' : 7, '1w' : 15, '1M' : 61};

    const [oneMinuteTicks, twelveHoursTicks ] = await Promise.all([
            binance.candles({ symbol: asset, interval: '1m' }),
            binance.candles({ symbol: asset, interval: '12h' }),
        ]);

    const len1 = oneMinuteTicks.length, len12 = twelveHoursTicks.length;

    const recentTick = oneMinuteTicks[len1 - 1];
    
    // console.log(oneMinuteTicks[400], twelveHoursTicks[400])
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
        const ca = changeAnalysis(recentTick.close, shiftTick.close);

        sum+=ca;

        data[val] = ca;
    })

    data.average = sum/(tf.length);

    res.json({ data });
    res.end();
}

module.exports = { calculateCA };