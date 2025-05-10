const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

// Pinata API credentials
const { PINATA_API_KEY, PINATA_SECRET_API_KEY } = process.env;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    console.error('Missing Pinata API credentials in .env file');
    process.exit(1);
}

// Function to upload a file to Pinata
async function uploadToPinata(filePath) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post(url, formData, {
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders(),
                'pinata_api_key': PINATA_API_KEY.trim(),
                'pinata_secret_api_key': PINATA_SECRET_API_KEY.trim()
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data
            });
        }
        throw error;
    }
}

// Get the file path from command line arguments
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
}

// Upload the file
uploadToPinata(filePath)
    .then(result => console.log('Upload successful:', result))
    .catch(error => {
        console.error('Upload failed');
        process.exit(1);
    });