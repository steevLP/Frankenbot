/**
 * converts array of duration codes to seconds
 * supported types: s,m,h,d,w,M,y
 * @param {Array} durarr array of duration codes ['6d','4w']
 * @returns sum of input duration codes in seconds
 */
function hmstosecs(durarr) {
    let secs = 0
    durarr.forEach(arg => {
        num = arg.replace(/.$/,'')*1
        typ = arg.replace(/^\d+/,'')
        switch (typ) {
            case 's': secs += 1000 * num; break;
            case 'm': secs += 1000 * num *60; break;
            case 'h': secs += 1000 * num * 60 * 60; break;
            case 'd': secs += 1000 * num * 60 * 60 * 24; break;
            case 'w': secs += 1000 * num * 60 * 60 * 24 * 7; break;
            case 'M': secs += 1000 * num * 60 * 60 * 24 * 30; break;
            case 'y': secs += 1000 * num * 60 * 60 * 24 * 365; break;
        }
    });
    return secs
}

module.exports = hmstosecs;