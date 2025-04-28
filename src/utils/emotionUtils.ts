// Types and interfaces for emotion detection
export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral' | 'no-face';

export interface EmotionResult {
  emotion: Emotion;
  confidence: number;
  faceDetected: boolean;
}

// Store the last detected emotion to prevent rapid changes
let lastEmotion: Emotion = 'neutral';
let lastConfidence: number = 0.75;
let detectionCounter = 0;
let noFaceCounter = 0;
// Increase this threshold to make the system less sensitive to false positives
const NO_FACE_THRESHOLD = 5; // Lower threshold to switch to "no-face" state faster

// For the web demo, we'll use a mock function to simulate detection
export const detectEmotion = (imageData: ImageData): EmotionResult => {
  // In a real app, this would process the imageData with a TensorFlow model
  detectionCounter++;
  
  // Simulate face detection with improved logic
  const hasFace = simulateFaceDetection(imageData);
  
  if (!hasFace) {
    noFaceCounter++;
    // If no face detected for several consecutive frames, report no face
    // More aggressive threshold to show "no-face" state sooner
    if (noFaceCounter > NO_FACE_THRESHOLD) {
      return {
        emotion: 'no-face',
        confidence: 0,
        faceDetected: false
      };
    }
    
    // For short periods with no face, maintain the last detected emotion
    // but with declining confidence
    return {
      emotion: lastEmotion,
      confidence: Math.max(0, lastConfidence - 0.1), // More rapidly decrease confidence
      faceDetected: false
    };
  }
  
  // Reset no face counter when face is detected
  noFaceCounter = 0;
  
  // Add an initial delay to simulate "analyzing" the face
  if (detectionCounter < 20) {
    return {
      emotion: 'neutral',
      confidence: 0.5 + (detectionCounter / 20 * 0.3), // Gradually increase confidence
      faceDetected: true
    };
  }
  
  // Only potentially change the emotion every ~30 frames to make it more stable
  if (detectionCounter % 30 === 0) {
    const emotions: Emotion[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
    
    // Generate a random weighted distribution that prefers 'happy' and 'neutral'
    // to make the demo feel more realistic
    const weights = [0.25, 0.10, 0.10, 0.15, 0.05, 0.05, 0.30]; // Weights for each emotion
    
    // Add bias to stay on the current emotion (stability)
    const currentEmotionIndex = emotions.indexOf(lastEmotion);
    if (currentEmotionIndex !== -1) {
      const biasedWeights = [...weights];
      biasedWeights[currentEmotionIndex] += 0.4; // Bias toward current emotion
      
      // Normalize weights
      const sum = biasedWeights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < biasedWeights.length; i++) {
        biasedWeights[i] = biasedWeights[i] / sum;
      }
      
      // Select an emotion based on the biased weights
      const random = Math.random();
      let sum2 = 0;
      
      for (let i = 0; i < emotions.length; i++) {
        sum2 += biasedWeights[i];
        if (random < sum2) {
          lastEmotion = emotions[i];
          break;
        }
      }
    }
    
    // Slightly adjust confidence but keep it realistic
    lastConfidence = 0.7 + Math.random() * 0.25;
  }
  
  // Simulate small variations in confidence
  const confidenceVariation = (Math.random() - 0.5) * 0.05;
  const adjustedConfidence = Math.min(0.98, Math.max(0.65, lastConfidence + confidenceVariation));
  
  return {
    emotion: lastEmotion,
    confidence: adjustedConfidence,
    faceDetected: true
  };
};

// Helper function to simulate face detection with improved accuracy
function simulateFaceDetection(imageData: ImageData): boolean {
  // This would be a real face detection algorithm in production
  // For the demo, we'll make it much more strict to prevent false positives
  
  // Check if the image is mostly black/blank (common when no face is present)
  // Simple image analysis - in real implementation this would use a proper ML model
  const isEmpty = isImageEmpty(imageData);
  if (isEmpty) {
    return false;
  }
  
  // Increase the chance of detecting "no face" to 40% (from 5%)
  // This makes the app much more likely to show "no-face" when appropriate
  const randomFailure = Math.random() < 0.40;
  
  // Every 50 frames (reduced from 100), simulate a brief period of no face detected
  const dropFrames = detectionCounter % 50 < 15; // Longer periods of no detection
  
  return !(dropFrames || randomFailure);
}

// Simple helper to check if an image is mostly empty/dark
function isImageEmpty(imageData: ImageData): boolean {
  // This is a simplified check - in a real app this would be more sophisticated
  // Sample pixels and check brightness
  const data = imageData.data;
  const pixelCount = data.length / 4; // RGBA values
  const sampleSize = Math.min(1000, pixelCount); // Sample up to 1000 pixels
  const samplingStep = Math.floor(pixelCount / sampleSize);
  
  let totalBrightness = 0;
  let samplesChecked = 0;
  
  // Sample pixels throughout the image
  for (let i = 0; i < data.length; i += 4 * samplingStep) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Calculate brightness (simple average)
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    samplesChecked++;
    
    if (samplesChecked >= sampleSize) break;
  }
  
  // Calculate average brightness
  const avgBrightness = totalBrightness / samplesChecked;
  
  // If brightness is below threshold, consider the image empty (no face)
  // Adjust threshold as needed for your specific use case
  return avgBrightness < 30; // Lower threshold for "empty" detection
}

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
    'no-face': `bg-gray-400`,
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
    'no-face': "No face detected. Please position yourself in front of the camera.",
  };
  
  return descriptions[emotion];
};

// Format confidence percentage
export const formatConfidence = (confidence: number): string => {
  if (isNaN(confidence) || confidence === null || confidence === undefined) {
    return "0%"; // Return 0% instead of NaN%
  }
  return `${Math.round(confidence * 100)}%`;
};
