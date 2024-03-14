const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Path to the data.json file
const dataPath = './data1.json';

// Read data from data.json
const dataArray = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Directory where the QR codes will be saved
const qrDirectory = './qr1';

// Ensure the qr directory exists
if (!fs.existsSync(qrDirectory)){
  fs.mkdirSync(qrDirectory, { recursive: true });
}

// Function to generate QR code
const generateQR = async (text, filepath) => {
  try {
    await QRCode.toFile(filepath, text);
    console.log(`QR Code generated: ${filepath}`);
  } catch (err) {
    console.error(`Failed to generate QR Code for ${text}`, err);
  }
};

// Generate a QR code for each item in the array
dataArray.forEach(item => {
  const qrPath = path.join(qrDirectory, `${item._id}.png`);
  generateQR(item._id, qrPath);
});
