
/**
 * This is a helper script to download and set up Face-API.js models.
 * You can run this with Node.js to automatically download and extract the models.
 * 
 * Usage: node setup-models.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Base URL for the models
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Models we need
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

// Download a file from URL
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
async function setup() {
  console.log('Setting up Face-API.js models...');
  
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
  
  console.log('Model setup completed!');
}

setup().catch(err => {
  console.error('Setup failed:', err);
});
