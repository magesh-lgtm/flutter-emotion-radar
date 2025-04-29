
// Script to download Face-API.js models
// Run this with Node.js to automatically download all required model files
const https = require('https');
const fs = require('fs');
const path = require('path');

// Base URL for the Face-API.js models
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Models needed for our application
const MODELS = [
  {
    dir: 'tiny_face_detector',
    files: [
      'tiny_face_detector_model-shard1',
      'tiny_face_detector_model-weights_manifest.json'
    ]
  },
  {
    dir: 'face_landmark_68',
    files: [
      'face_landmark_68_model-shard1',
      'face_landmark_68_model-weights_manifest.json'
    ]
  },
  {
    dir: 'face_expression',
    files: [
      'face_expression_model-shard1',
      'face_expression_model-weights_manifest.json'
    ]
  }
];

// Function to download a file
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(resolve);
        console.log(`Downloaded: ${dest}`);
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

// Create directory if it doesn't exist
const ensureDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Main function
async function downloadModels() {
  console.log('Starting Face-API.js model download...');
  
  for (const model of MODELS) {
    const modelDir = path.join(__dirname, model.dir);
    ensureDir(modelDir);
    
    for (const file of model.files) {
      const url = `${BASE_URL}/${model.dir}/${file}`;
      const dest = path.join(modelDir, file);
      
      try {
        await downloadFile(url, dest);
      } catch (err) {
        console.error(`Error downloading ${file}:`, err);
      }
    }
  }
  
  console.log('Model download completed successfully!');
  console.log('You can now run your application with Face-API.js face detection.');
}

// Run the download
downloadModels().catch(console.error);
