const express = require('express');
const { addAsset, removeAsset, getAllAssets } = require('../controllers/watchlist');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Welcome to BE GREAT FINANCE')
});

router.post('/api/watchlist/:asset', addAsset);

router.delete('/api/watchlist/:asset', removeAsset);

router.get('/api/watchlist/:sort', getAllAssets);

module.exports = router;