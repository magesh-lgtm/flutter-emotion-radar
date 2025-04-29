
import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

// Main function to load all required models
export const loadFaceApiModels = async (): Promise<void> => {
  if (modelsLoaded) {
    return;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = (async () => {
    try {
      console.log('Loading Face-API.js models...');
      
      // Set the models path - these will be loaded from the public directory
      const MODEL_URL = '/models';
      
      // Load required face-api.js models in sequence
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      console.log('Tiny Face Detector model loaded');
      
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      console.log('Face Landmark model loaded');
      
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log('Face Expression model loaded');
      
      modelsLoaded = true;
      console.log('All Face-API.js models loaded successfully');
    } catch (error) {
      console.error('Error loading Face-API.js models:', error);
      throw error;
    }
  })();
  
  return loadingPromise;
};

// Function to detect emotions in an image
export const detectFaceEmotions = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>> | null> => {
  if (!modelsLoaded) {
    console.warn('Models not loaded yet. Loading models now...');
    try {
      await loadFaceApiModels();
    } catch (error) {
      console.error('Failed to load models:', error);
      return null;
    }
  }

  try {
    // Detect faces with expressions using TinyFaceDetector
    const detections = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    
    return detections || null;
  } catch (error) {
    console.error('Error in face detection:', error);
    return null;
  }
};

// Map Face-API emotion to our app's emotion type
export const mapFaceApiEmotionToAppEmotion = (
  expressions: faceapi.FaceExpressions | undefined
): { emotion: Emotion, confidence: number } => {
  if (!expressions) {
    return { emotion: 'no-face', confidence: 0 };
  }
  
  // Get all expressions and their probabilities
  const emotionPairs = Object.entries(expressions).map(([emotion, probability]) => ({
    emotion,
    probability
  }));
  
  // Sort by probability (highest first)
  const sortedEmotions = emotionPairs.sort((a, b) => b.probability - a.probability);
  
  // Map Face-API.js emotions to our app's emotions
  if (sortedEmotions.length > 0) {
    const topEmotion = sortedEmotions[0].emotion;
    const confidence = sortedEmotions[0].probability;
    
    // Map to our emotion types
    switch (topEmotion) {
      case 'happy':
        return { emotion: 'happy', confidence };
      case 'sad':
        return { emotion: 'sad', confidence };
      case 'angry':
        return { emotion: 'angry', confidence };
      case 'surprised':
        return { emotion: 'surprised', confidence };
      case 'fearful':
        return { emotion: 'fearful', confidence };
      case 'disgusted':
        return { emotion: 'disgusted', confidence };
      case 'neutral':
        return { emotion: 'neutral', confidence };
      default:
        return { emotion: 'neutral', confidence };
    }
  }
  
  return { emotion: 'neutral', confidence: 0.5 };
};

// Type definitions to match with our app
export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral' | 'no-face';

export interface EmotionResult {
  emotion: Emotion;
  confidence: number;
  faceDetected: boolean;
}
