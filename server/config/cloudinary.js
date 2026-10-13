const config = require('./config');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return result;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const destroyFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
        });

        return result;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

module.exports = {
    uploadFile,
    destroyFile,
};