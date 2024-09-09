const AWS = require('aws-sdk');
const { promisify } = require('util');

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToAWSChunk = (chunks,name) => {
    const fileBuffer = Buffer.concat(chunks);
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileName = name;
    const params = {
        Bucket: "mydocsforcms",
        Key: fileName,
        Body: fileBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read', 
    };
    return new Promise((resolve, reject) => {
        const uploadToS3 = promisify(s3.upload.bind(s3));

        uploadToS3(params)
            .then(({ Location }) => {
                resolve(Location);
            })
            .catch((error) => {
                console.error('Error uploading image to S3:', error);
                reject(error); 
            });
    });
};

module.exports = uploadToAWSChunk;
