
# Face-API.js Models

These model files are required for the Face-API.js library to work correctly. The application will load these models from this directory.

## Required Models
- TinyFaceDetector model
- FaceLandmarks68 model
- FaceExpressions model

## Automatic Setup

You can automatically download all required models by running the included script:

```bash
node download-models.js
```

## Manual Setup

If the automatic script doesn't work, you can manually set up the models:

1. Create the following directories in this folder:
   - `tiny_face_detector`
   - `face_landmark_68`
   - `face_expression`

2. Download the model files from the Face-API.js repository:
   https://github.com/justadudewhohacks/face-api.js/tree/master/weights

3. Place the model files in their respective directories.

## Troubleshooting

If you encounter a 404 error when loading models, ensure that:

1. The model files are properly downloaded in the correct directories
2. The file names match exactly what face-api.js expects
3. Your server is properly serving files from the public directory

Without these models, the facial emotion detection will not work.
