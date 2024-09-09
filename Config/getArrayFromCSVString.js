function csvStringToArray(csvString) {
    csvString = csvString.trim();
    
    const emailArray = csvString.split(',').filter(email => email.trim() !== '');
    
    return emailArray;
}

module.exports={csvStringToArray}
  