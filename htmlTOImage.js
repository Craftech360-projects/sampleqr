const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Read the template
const templateData = JSON.parse(fs.readFileSync('./sample.json', 'utf8'));
const templateHtml = templateData.template;

// Read data from data.json
const dataArray = JSON.parse(fs.readFileSync('./data1.json', 'utf8'));

// Directory for the output images
const outputDir = './output';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to replace template placeholders and generate image
const generateImageFromHtml = async (htmlContent, outputFilePath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1752, height: 1600});
  await page.setContent(htmlContent);

  await page.screenshot({path: outputFilePath});
  await browser.close();
};

// Process each item sequentially
const processItemsSequentially = async () => {
  count=0;
  for (const item of dataArray) {
    // Replace placeholder with the actual image path
    const itemHtml = templateHtml.replace('{{image}}', `https://raw.githubusercontent.com/Craftech360-projects/sampleqr/main/qr1/${item._id}.png`)
    .replace(`{{firstName}}`, item.Name)
    .replace(`{{Position}}`, item.Designation===undefined? '' : item.Designation)
    .replace(`{{Company}}`, item.Company===undefined? '': item.Company);
    console.log(itemHtml);
    // Define the output file path
    const outputFilePath = path.join(outputDir, `${item.Name}_${count}.png`);
    console.log(`Generating image for ${item._id}...`);
    // Generate the image
    await generateImageFromHtml(itemHtml, outputFilePath);
    console.log(`Image generated for ${item._id}`);
    count++;
    console.log(`Processed item ${count} of ${dataArray.length}`);
  }

  console.log('All items have been processed.');
};

processItemsSequentially();
