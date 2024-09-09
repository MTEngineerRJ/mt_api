function convertObjectToString(obj) {
    const result = [];
  
    function parseObject(obj, prefix = '') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const currentKey = prefix ? `${prefix}.${key}` : key;
  
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            parseObject(obj[key], currentKey);
          } else {
            result.push(`${currentKey},${obj[key]}`);
          }
        }
      }
    }
  
    parseObject(obj);
    return result.join(',');
  }

  
module.exports=convertObjectToString