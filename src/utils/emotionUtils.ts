
// Dummy data for simulating emotion detection since we can't integrate with TensorFlow Lite in this web app
export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

export interface EmotionResult {
  emotion: Emotion;
  confidence: number;
}

// For the web demo, we'll use a mock function to simulate detection
export const detectEmotion = (imageData: ImageData): EmotionResult => {
  // In a real app, this would process the imageData with a TensorFlow model
  
  // For the demo, return random emotions with varying confidence
  const emotions: Emotion[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
  
  // Generate a random weighted distribution that prefers 'happy' and 'neutral'
  // to make the demo feel more realistic
  const weights = [0.25, 0.10, 0.10, 0.15, 0.05, 0.05, 0.30]; // Weights for each emotion
  
  // Select an emotion based on the weights
  const random = Math.random();
  let sum = 0;
  let selectedEmotion: Emotion = 'neutral';
  
  for (let i = 0; i < emotions.length; i++) {
    sum += weights[i];
    if (random < sum) {
      selectedEmotion = emotions[i];
      break;
    }
  }
  
  // Generate a relatively high confidence for more realistic feel
  const confidence = 0.7 + Math.random() * 0.3;
  
  return {
    emotion: selectedEmotion,
    confidence
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
