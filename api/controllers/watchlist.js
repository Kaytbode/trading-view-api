const Binance = require('binance-api-node').default;
const { pool } = require('../database/index');
const { changeAnalysis } = require('../helper/indicator');
const { sortAssets } = require('../helper/sort');
const { calculatePulseandShift, calculateShift, 
        calculateHAandMomentumOutput } = require('../helper/pulseshift');
const { regex, regexSort, validate } = require('../utils/validation');

const binance = Binance();

const addAsset = async (req, res) => {
    const { asset } = req.params;

    if (!regex.test(asset)){
        throw new Error('Wrong Asset Name')
    }

    const text = 'INSERT INTO watchlist(asset) VALUES($1) RETURNING *';
    const values = [asset];

    await pool.query(text, values);

    res.json({operation: `${asset} successfully added to watchlist`});
    res.end();
}

const removeAsset = async (req, res) => {
    const { asset } = req.params;

    if (!regex.test(asset)){
        throw new Error('Wrong Asset Name')
    }

    const text = 'DELETE FROM watchlist WHERE asset = ($1) RETURNING *';
    const values = [asset];

    await pool.query(text, values);

    res.json({operation: `${asset} successfully removed from watchlist`});
    res.end();
}

const getAllAssets = async (req, res) => {
    const { pulse, shift, wltf } = req.query;
    const { sort } = req.params;

    if (!regexSort.test(sort)){
        throw new Error('Specify a number from 1 - 4');
    }

    if (!regex.test(wltf)){
        throw new Error('watch timeframe format not correct');
    }

    if ((!Array.isArray(pulse)) || 
        (!Array.isArray(shift)) ||
        (!pulse.every(validate)) ||
        (!shift.every(validate))){
        throw new Error('Refer to the docs on how to specify pulse and shift values');
    }

    const text = 'SELECT asset FROM watchlist';
    // Get all assets from database
    const { rows } = await pool.query(text)

    const assets = rows.map(({asset})=> asset);

    const data =[], specialShiftTfs = {'12h': 2, '1d' : 3, '3d' : 7, '1w' : 15, '1M' : 61};

    // Intervals supported by Binance API: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M

    // average of shift values for all watchlist assets
    let wltfAverage = 0;

    assets.forEach(async (asset, idx, arr) => {
        asset = asset.toUpperCase();
        
        const [oneMinuteTicks, thirtyMinutesTicks,
               twelveHoursTicks, oneWeekTicks ] = await Promise.all([
                binance.candles({ symbol: asset, interval: '1m' }),
                binance.candles({ symbol: asset, interval: '30m' }),
                binance.candles({ symbol: asset, interval: '12h' }),
                binance.candles({ symbol: asset, interval: '1w' })
            ]);
        
        const len1 = oneMinuteTicks.length, len12 = twelveHoursTicks.length;

        const recentTick = oneMinuteTicks[len1 - 1];

        const storeCA = [], storeAsset = {name: asset};

        let sum = 0;
        
        shift.forEach(val => {
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
            storeCA.push(ca);

            sum+=ca;
        })

        const shiftValue = calculateShift(storeCA);
        storeAsset.shift = shiftValue;
        storeAsset.average = sum/(shift.length);
        
        // calculate pulse values
        let pulseValue = 0;

        pulse.every(val => {
            let ticks, divisor;
            val = +val;

            if (val < 30 ) {
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

            if (!specialShiftTfs.hasOwnProperty(wltf)) {
                i = len1 - wltf;
                shiftTick = oneMinuteTicks[i];
            } 
            else  {
                i = len12 - specialShiftTfs[wltf];
                shiftTick = twelveHoursTicks[i];
            }

            wlCA = changeAnalysis(recentTick.close, shiftTick.close);
        }

        storeAsset.wltf = wlCA || storeAsset.average;
        wltfAverage+=wlCA;

        data.push(storeAsset);

        if (idx === (arr.length - 1)){
            data.push({totalAverage: (wltfAverage/arr.length)});

            setTimeout(() => {
                const sortedData = sortAssets(data, sort);
                res.json({ data : sortedData });
                res.end();
            }, 2000);
        }
    });
}

module.exports = { addAsset, removeAsset, getAllAssets };