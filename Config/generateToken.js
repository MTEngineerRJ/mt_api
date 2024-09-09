function generateUniqueToken() {
    // Implement your logic here to generate a unique token
    // Example: return a random string or use a library like uuid
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

module.exports = generateUniqueToken;