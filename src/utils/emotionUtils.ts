// Dummy data for simulating emotion detection since we can't integrate with TensorFlow Lite in this web app
export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

export interface EmotionResult {
  emotion: Emotion;
  confidence: number;
}

// Store the last detected emotion to prevent rapid changes
let lastEmotion: Emotion = 'neutral';
let lastConfidence: number = 0.75;
let detectionCounter = 0;

// For the web demo, we'll use a mock function to simulate detection
export const detectEmotion = (imageData: ImageData): EmotionResult => {
  // In a real app, this would process the imageData with a TensorFlow model
  
  // Only change emotion occasionally to make it seem more stable
  detectionCounter++;
  
  // Add an initial delay to simulate "analyzing" the face
  if (detectionCounter < 20) {
    return {
      emotion: 'neutral',
      confidence: 0.5 + (detectionCounter / 20 * 0.3) // Gradually increase confidence
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
    confidence: adjustedConfidence
  };
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
