
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
const NO_FACE_THRESHOLD = 10; // Number of frames before we declare "no face"

// For the web demo, we'll use a mock function to simulate detection
export const detectEmotion = (imageData: ImageData): EmotionResult => {
  // In a real app, this would process the imageData with a TensorFlow model
  detectionCounter++;
  
  // Simulate face detection (random chance of no face being detected)
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
      confidence: Math.max(0, lastConfidence - 0.05),
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

// Helper function to simulate face detection
function simulateFaceDetection(imageData: ImageData): boolean {
  // This would be a real face detection algorithm in production
  // For now, let's assume there's a 95% chance of detecting a face
  // with some periodic drops to simulate realistic detection failures
  
  // Every 100 frames, simulate a brief period of no face detected
  const dropFrames = detectionCounter % 100 < 5;
  
  // Random chance (5%) of failing to detect a face on any frame
  const randomFailure = Math.random() < 0.05;
  
  return !(dropFrames || randomFailure);
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
