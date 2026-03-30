const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Folder with images on your laptop
const folderPath = './listing_images'; // make sure path is correct

fs.readdir(folderPath, (err, files) => {
  if (err) return console.log(err);

  files.forEach(file => {
    const filePath = `${folderPath}/${file}`;
    cloudinary.uploader.upload(filePath, { folder: 'wanderlust' })
      .then(result => {
        console.log(result.secure_url); // Copy this URL for your seed file
      })
      .catch(err => console.log(err));
  });
});