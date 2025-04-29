
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
// Higher threshold to make the system more responsive to "no-face" state
const NO_FACE_THRESHOLD = 3; 

// For the web demo, we'll use a mock function to simulate detection
export const detectEmotion = (imageData: ImageData): EmotionResult => {
  // In a real app, this would process the imageData with a TensorFlow model
  detectionCounter++;
  
  // Check if the image is mostly empty (indicates no face)
  const isEmpty = isImageEmpty(imageData);
  
  // Immediately report no face if the image is empty
  if (isEmpty) {
    noFaceCounter += 2; // Increase counter more aggressively
    
    if (noFaceCounter > NO_FACE_THRESHOLD) {
      return {
        emotion: 'no-face',
        confidence: 0,
        faceDetected: false
      };
    }
  }
  
  // Simulate face detection with improved logic
  const hasFace = simulateFaceDetection(imageData);
  
  if (!hasFace) {
    noFaceCounter++;
    
    // If no face detected for several consecutive frames, report no face
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
      confidence: Math.max(0, lastConfidence - 0.2), // More rapidly decrease confidence
      faceDetected: false
    };
  }
  
  // Reset no face counter when face is detected
  noFaceCounter = Math.max(0, noFaceCounter - 1); // Gradually reduce counter when face is detected
  
  // Add an initial delay to simulate "analyzing" the face
  if (detectionCounter < 20) {
    return {
      emotion: 'neutral',
      confidence: 0.5 + (detectionCounter / 20 * 0.3), // Gradually increase confidence
      faceDetected: true
    };
  }

  // DEMO MODE: For demonstration purposes only
  // In a real implementation, this would be replaced with actual ML model inference
  // using a pre-trained facial emotion recognition model
  
  // Only potentially change the emotion every ~40 frames to make it more stable
  if (detectionCounter % 40 === 0) {
    // For demo purposes, we'll make neutral and happy more common
    const emotions: Emotion[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
    const weights = [0.20, 0.10, 0.10, 0.10, 0.05, 0.05, 0.40]; // Higher weight for neutral
    
    // Bias toward current emotion for stability
    const currentEmotionIndex = emotions.indexOf(lastEmotion);
    if (currentEmotionIndex !== -1) {
      const biasedWeights = [...weights];
      biasedWeights[currentEmotionIndex] += 0.6; // Stronger bias toward current emotion
      
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
  
  // Check if the image is mostly black/blank (common when no face is present)
  const isEmpty = isImageEmpty(imageData);
  if (isEmpty) {
    return false;
  }
  
  // Higher chance of detecting "no face" to make the app more responsive
  const randomFailure = Math.random() < 0.30;
  
  // Every 40 frames, simulate a brief period of no face detected
  const dropFrames = detectionCounter % 40 < 10; 
  
  return !(dropFrames || randomFailure);
}

// More sophisticated image analysis to detect empty/dark frames
function isImageEmpty(imageData: ImageData): boolean {
  const data = imageData.data;
  const pixelCount = data.length / 4; // RGBA values
  const sampleSize = Math.min(2000, pixelCount); // Sample more pixels for better accuracy
  const samplingStep = Math.floor(pixelCount / sampleSize);
  
  let totalBrightness = 0;
  let samplesChecked = 0;
  let highContrastCount = 0;
  
  // Sample pixels throughout the image
  for (let i = 0; i < data.length; i += 4 * samplingStep) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness (simple average)
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    
    // Check for high contrast (potential edge detection)
    if (i > 4 * samplingStep) {
      const prevR = data[i - 4 * samplingStep];
      const prevG = data[i - 4 * samplingStep + 1];
      const prevB = data[i - 4 * samplingStep + 2];
      const prevBrightness = (prevR + prevG + prevB) / 3;
      
      if (Math.abs(brightness - prevBrightness) > 50) {
        highContrastCount++;
      }
    }
    
    samplesChecked++;
    if (samplesChecked >= sampleSize) break;
  }
  
  // Calculate average brightness
  const avgBrightness = totalBrightness / samplesChecked;
  
  // Consider both brightness and contrast for face detection
  // This is a very simplified approach - real face detection uses ML models
  return (avgBrightness < 35 || highContrastCount < sampleSize / 20);
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
