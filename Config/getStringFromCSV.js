 const splitStringToArray = (inputString) =>{
    // Check if the input string is empty
    if (!inputString.trim()) {
        // Return an empty array if the input string is empty
        return [];
    }

    // Split the input string by commas
    const dataArray = inputString.split(',');

    // Trim whitespace from each element and filter out empty strings
    const trimmedArray = dataArray.map(item => item.trim()).filter(item => item !== '');

    return trimmedArray;
}

module.exports = {splitStringToArray}