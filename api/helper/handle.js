const handle = (promise) =>
    promise
        .then(data => [undefined, data])
        .catch(error => Promise.resolve([error, undefined]));


const handleResults = (results)=>{
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason)
    
    if (errors.length) {
        throw new AggregateError(errors)
    }
    
    return results.map(({ value })=> value );
}

module.exports = { handle, handleResults }