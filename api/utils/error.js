const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
};
// Route not found (404)
const clientError404Handler = (req, res) =>{
    return res.status(404).send(`Cannot GET ${req.url}`);
};

const clientError500Handler = (err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
};

const errorHandler = (err, req, res) => {
    res.status(500);
    res.render('error', { error: err });
};

module.exports = {
    logErrors,
    clientError500Handler,
    clientError404Handler,
    errorHandler,
};