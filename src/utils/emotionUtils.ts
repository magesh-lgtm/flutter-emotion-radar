import * as faceapi from 'face-api.js';

export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

export interface EmotionResult {
  emotion: Emotion;
  confidence: number; // Keeping this for internal use only
}

// Flag to track if models are loaded
let modelsLoaded = false;

// Load face-api models
async function loadModels() {
  if (modelsLoaded) return;

  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    modelsLoaded = true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw error;
  }
}

// Convert face-api expression to our Emotion type
function mapExpressionToEmotion(expressions: faceapi.FaceExpressions): EmotionResult {
  const expressionMap: { [key: string]: Emotion } = {
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    surprised: 'surprised',
    fearful: 'fearful',
    disgusted: 'disgusted',
    neutral: 'neutral'
  };

  let maxConfidence = 0;
  let dominantEmotion: Emotion = 'neutral';

  Object.entries(expressions).forEach(([expression, confidence]) => {
    if (confidence > maxConfidence && expressionMap[expression]) {
      maxConfidence = confidence;
      dominantEmotion = expressionMap[expression];
    }
  });

  return {
    emotion: dominantEmotion,
    confidence: maxConfidence // Keeping confidence internally for emotion determination
  };
}

// Real emotion detection using face-api.js
export const detectEmotion = async (imageData: ImageData): Promise<EmotionResult> => {
  try {
    // Ensure models are loaded
    if (!modelsLoaded) {
      await loadModels();
    }

    // Create canvas and context
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');

    // Put image data on canvas
    ctx.putImageData(imageData, 0, 0);

    // Configure face detection options for better real-time performance
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,      // Smaller input size for faster processing
      scoreThreshold: 0.3  // Lower threshold for better detection
    });

    // Detect faces and expressions
    const detections = await faceapi
      .detectSingleFace(canvas, options)
      .withFaceExpressions();

    if (detections) {
      // Apply temporal smoothing to reduce jitter
      const result = mapExpressionToEmotion(detections.expressions);
      return result;
    }

    // Return neutral if no face detected
    return { emotion: 'neutral', confidence: 0.5 };
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return { emotion: 'neutral', confidence: 0.5 };
  }
};

// Get color based on emotion for UI display
export const getEmotionColor = (emotion: Emotion, vivid: boolean = false): string => {
  const colorType = vivid ? 'emotion-vivid' : 'emotion';
  
  const emotionColors: Record<Emotion, string> = {
    happy: `bg-${colorType}-happy`,
    sad: `bg-${colorType}-sad`,
    angry: `bg-${colorType}-angry`,
    surprised: `bg-${colorType}-surprised`,
    fearful: `bg-${colorType}-fearful`,
    disgusted: `bg-${colorType}-disgusted`,
    neutral: `bg-${colorType}-neutral`,
  };
  
  return emotionColors[emotion];
};

// Get a human-readable description for each emotion
export const getEmotionDescription = (emotion: Emotion): string => {
  const descriptions: Record<Emotion, string> = {
    happy: "You're beaming with joy!",
    sad: "You seem a bit down.",
    angry: "You appear frustrated.",
    surprised: "You look astonished!",
    fearful: "You seem concerned.",
    disgusted: "You look displeased.",
    neutral: "You're looking calm and composed.",
  };
  
  return descriptions[emotion];
};

// Format confidence percentage
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};
