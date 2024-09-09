const breakString = (base64String)=>{
        const prefix = 'data:image/png;base64,';
       return String(base64String).split(prefix)[1];
    
}

module.exports = {breakString}