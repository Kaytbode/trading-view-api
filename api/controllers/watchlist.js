const Binance = require('node-binance-api');

const binance = new Binance().options();



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