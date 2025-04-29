
# Face-API.js Models

These model files are required for the Face-API.js library to work. The application will automatically load these models from this directory.

## Required Models
- TinyFaceDetector model
- FaceLandmarks68 model
- FaceExpressions model

## Model Source
These models come from the Face-API.js project and should be downloaded from their official repository.

## Installation Instructions
To properly set up the models:

1. Create the following directories in this folder:
   - `tiny_face_detector`
   - `face_landmark_68`
   - `face_expression`

2. Download the model files from the Face-API.js repository:
   https://github.com/justadudewhohacks/face-api.js/tree/master/weights

3. Place the model files in their respective directories.

Without these models, the facial emotion detection will not work.
