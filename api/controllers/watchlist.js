const Binance = require('node-binance-api');
const { pool } = require('../database/index');

const binance = new Binance().options();

const addAsset = async (req, res) => {
    const { asset } = req.params;

    const text = 'INSERT INTO watchlist(asset) VALUES($1) RETURNING *';
    const values = [asset];

    await pool.query(text, values);

    res.json({operation: `${asset} successfully added to watchlist`});
    res.end();
}

const removeAsset = async (req, res) => {
    const { asset } = req.params;

    const text = 'DELETE FROM watchlist WHERE asset = ($1) RETURNING *';
    const values = [asset];

    await pool.query(text, values);

    res.json({operation: `${asset} successfully removed from watchlist`});
    res.end();
}

(async function (){
    //const ticks = await binance.candlesticks('BNBBTC', '1s', ()=>{}, {limit: 2, endTime: Date.now()});

    //console.log(ticks);
    binance.candlesticks("SOLUSDT", "1s", (error, ticks, symbol) => {
        console.info(Date.now());
        console.info(ticks);
    // console.info("candlesticks()", ticks);
        let last_tick = ticks[ticks.length - 1];
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        //console.info(symbol+" last close: "+close);
    }, {limit: 2, endTime: Date.now()});

    binance.candlesticks("SOLUSDT", "1d", (error, ticks, symbol) => {
        console.info(Date.now());
        console.info(ticks);
    // console.info("candlesticks()", ticks);
        let last_tick = ticks[ticks.length - 1];
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        //console.info(symbol+" last close: "+close);
    }, {limit: 2, endTime: Date.now()});
 /* binance.websockets.chart("BNBBTC", "1m", (symbol, interval, chart) => {
    let tick = binance.last(chart);
    // const last = chart[tick].close;
    console.info(chart);
    // Optionally convert 'chart' object to array:
    // let ohlc = binance.ohlc(chart);
    // console.info(symbol, ohlc);
    //console.info(symbol+" last price: "+last)
  });*/
})();

module.exports = { addAsset, removeAsset };