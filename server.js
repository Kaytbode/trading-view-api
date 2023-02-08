const Binance = require('node-binance-api');
//const { pool } = require('../database/index');

const binance = new Binance().options();

(async ()=> {
    setInterval(async ()=>{
        const tick = await binance.candlesticks('SOLUSDT', '1m')
        console.log(tick[tick.length - 1]);
    }, 5000);
    


   /* binance.candlesticks('SOLUSDT', "1m", (error, ticks, symbol) => {
        sticks = ticks;
        //console.log(ticks);
       // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
    }, {limit: 1, endTime: Date.now()});*/

   // console.log('hey');
   // console.log(Date.now());
})();

/*const o = {'1d': 4}
const val = '1du';

if (o.hasOwnProperty(val)) console.log('yeah');

else console.log('nay'); */