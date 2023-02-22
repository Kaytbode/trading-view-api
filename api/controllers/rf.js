const Binance = require('binance-api-node').default;
const { riseAndFall } = require('../helper/indicator');
const { regex, regexTF } = require('../utils/validation');

const binance = Binance();

const calculateRF = async (req, res) => {
    let { asset } = req.params;
    const { tf } = req.query;

    asset = asset.toUpperCase();

    if (!regex.test(asset)){
        throw new Error('Wrong Asset Name');
    }

    if (!regexTF.test(tf)){
        throw new Error('Timeframe not supported');
    }

    // Intervals supported 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M

    const tick = await binance.candles({ symbol: asset, interval: tf, limit: 1 });

    const { close, high, low } = tick[0];

    const { rise, fall } = riseAndFall(+close, +low, +high);

    res.json({ asset, rise, fall });
    res.end();
}

module.exports = { calculateRF };