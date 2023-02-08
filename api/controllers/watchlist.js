const Binance = require('node-binance-api');
const { pool } = require('../database/index');
const { changeAnalysis } = require('../helper/indicator');
const { sortAssets } = require('../helper/sort');
const { calculatePulseandShift, calculateShift, 
        calculateHAandMomentumOutput } = require('../helper/pulseshift');

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

const getAllAssets = async (req, res) => {
    const { pulse, shift, wltf } = req.query;
    const { sort } = req.params;

    const text = 'SELECT asset FROM watchlist';

    // Get all assets from database
    const { rows } = await pool.query(text)

    const assets = rows.map(({asset})=> asset);

    const data =[], specialTfs = {'12h': 2, '1d' : 3, '3d' : 7, '1w' : 15, '1M' : 61};

    assets.forEach(async (asset, idx, arr) => {
        // Get the last 500 1-minute candles for each asset
        const ticks = await binance.candlesticks(asset, '1m');
        // Get the last 500 12-hr candles for each asset
        const specialTicks = await binance.candlesticks(asset, '12h');

        const len = ticks.length, speciaLen = specialTicks.length;

        const recentTick = ticks[len - 1];

        const storeCA = [], storeAsset = {name: asset};

        let sum = 0;

        shift.forEach(val => {
            let i, shiftTick;

            if (!specialTfs.hasOwnProperty(val)) {
                i = len - val;
                shiftTick = ticks[i];
            } 
            else  {
                i = speciaLen - specialTfs[val];
                shiftTick = specialTicks[i];
            }
            // calculate the change analysis 
            const ca = changeAnalysis(recentTick[4], shiftTick[4]);
            storeCA.push(ca);

            sum+=ca;
        })

        const shiftValue = calculateShift(storeCA);
        storeAsset.shift = shiftValue;
        storeAsset.average = sum/(shift.length);
        
        // calculate pulse values
        let pulseValue = 0;

        pulse.every(async val => {
            const ticks = await binance.candlesticks(asset, val);

            const output = calculateHAandMomentumOutput(ticks);

            if (output == -2 && pulseValue == -2) pulseValue = -2;
        
            else if (output == 2 && pulseValue == 2) pulseValue = 2;
        
            else if (pulseValue == 0) pulseValue = output;
            
            else {
                pulseValue = 0;
                return false;
            }
            
            return true;
        });

        storeAsset.pulse = pulseValue;
        storeAsset.score = calculatePulseandShift(pulseValue, shiftValue);

        let wlCA;

        if (wltf) {
            let i, shiftTick;

            if (!specialTfs.hasOwnProperty(val)) {
                i = len - val;
                shiftTick = ticks[i];
            } 
            else  {
                i = speciaLen - specialTfs[val];
                shiftTick = specialTicks[i];
            }

            wlCA = changeAnalysis(recentTick[4], shiftTick[4]);
        }

        storeAsset.wltf = wlCA || storeData.average;

        data.push(storeAsset);

        if (idx === (arr.length - 1)){
            setTimeout(() => {
                const sortedData = sortAssets(data, sort);
                res.json({ data : sortedData });
                res.end();
            }, 1000);
        }
    });

}

module.exports = { addAsset, removeAsset, getAllAssets };