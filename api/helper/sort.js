const compareAB = (a, b) => {
    if (a.score < b.score ) return -1;
    if (a.score > b.score ) return 1;
    if (a.score === b.score) {
       if (a.wltf > b.wltf) return 1;
       if (a.wltf < b.wltf) return -1;
       return 0;
    }
}

const compareABu = (a, b) => {
    if (a.score < b.score ) return 1;
    if (a.score > b.score ) return -1;
    if (a.score === b.score) {
       if (a.wltf > b.wltf) return -1;
       if (a.wltf < b.wltf) return 1;
       return 0;
    }
}

const compareBBu = (a, b) => {
    const absA = Math.abs(a.score);
    const absB = Math.abs(b.score);
    if (absA < absB) {
        return 1;
    }
    if (absA > absB) {
        return -1;
    }
    if (absA === absB) {
        if (a.score < b.score ) return 1;
        if (a.score > b.score ) return -1;
        if(a.score === b.score){
            if (a.score >= 0) {
                if (a.wltf > b.wltf) return -1;
                if (a.wltf < b.wltf) return 1;
            }
            if (a.score < 0) {
                if (a.wltf > b.wltf) return 1;
                if (a.wltf < b.wltf) return -1;
            }
            if (a.score == 0) {
                const aW = Math.abs(a.wltf);
                const bW = Math.abs(b.wltf);
                if (aW > bW) return -1;
                if (aW < bW) return 1;
            }
        }
       return 0;
    }
}

const compareBB = (a, b) => {
    const absA = Math.abs(a.score);
    const absB = Math.abs(b.score);
    if (absA < absB) {
        return 1;
    }
    if (absA > absB) {
        return -1;
    }
    if (absA === absB) {
        if (a.score < b.score ) return -1;
        if (a.score > b.score ) return 1;
        if(a.score === b.score){
            if (a.score > 0) {
                if (a.wltf > b.wltf) return -1;
                if (a.wltf < b.wltf) return 1;
            }
            if (a.score < 0) {
                if (a.wltf > b.wltf) return 1;
                if (a.wltf < b.wltf) return -1;
            }
            if (a.score == 0) {
                const aW = Math.abs(a.wltf);
                const bW = Math.abs(b.wltf);
                if (aW > bW) return -1;
                if (aW < bW) return 1;
            }
        }
       return 0;
    }
}

const sortAssets = ( data, sortValue ) => {
    switch(sortValue) {
        case '1':
            data.sort(compareABu);
            break;
        case '2':
            data.sort(compareAB);
            break;
        case '3':
            data.sort(compareBBu);
            break;
        case '4':
            data.sort(compareBB);
            break;
    }
    
    return data;
}

module.exports = { compareAB, compareABu, compareBB, compareBBu, sortAssets }