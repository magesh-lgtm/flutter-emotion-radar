
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Smile, 
  Frown, 
  AlertTriangle, 
  AlertCircle,
  ThumbsDown,
  Meh,
  Star,
  UserX,
  Info,
  Brain
} from "lucide-react";
import { 
  Emotion, 
  EmotionResult, 
  formatConfidence,
  getEmotionDescription 
} from '@/utils/emotionUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmotionDisplayProps {
  detectedEmotion: EmotionResult | null;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ detectedEmotion }) => {
  if (!detectedEmotion) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm text-white border-none shadow-lg">
        <CardContent className="pt-6 px-4 text-center">
          <div className="animate-pulse">
            <p>Detecting emotion...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { emotion, confidence, faceDetected } = detectedEmotion;
  
  // Get the appropriate icon for each emotion
  const getEmotionIcon = (emotion: Emotion) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="h-6 w-6 text-emotion-vivid-happy" />;
      case 'sad':
        return <Frown className="h-6 w-6 text-emotion-vivid-sad" />;
      case 'angry':
        return <AlertTriangle className="h-6 w-6 text-emotion-vivid-angry" />;
      case 'surprised':
        return <Star className="h-6 w-6 text-emotion-vivid-surprised" />;
      case 'fearful':
        return <AlertCircle className="h-6 w-6 text-emotion-vivid-fearful" />;
      case 'disgusted':
        return <ThumbsDown className="h-6 w-6 text-emotion-vivid-disgusted" />;
      case 'neutral':
        return <Meh className="h-6 w-6 text-emotion-vivid-neutral" />;
      case 'no-face':
        return <UserX className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Get background color based on emotion
  const getBgColor = (emotion: Emotion) => {
    const colors: Record<Emotion, string> = {
      happy: 'bg-emotion-happy',
      sad: 'bg-emotion-sad',
      angry: 'bg-emotion-angry',
      surprised: 'bg-emotion-surprised',
      fearful: 'bg-emotion-fearful',
      disgusted: 'bg-emotion-disgusted',
      neutral: 'bg-emotion-neutral',
      'no-face': 'bg-gray-200',
    };
    
    return colors[emotion];
  };
  
  // Color for the confidence progress bar
  const getProgressColor = (confidence: number, faceDetected: boolean) => {
    if (!faceDetected) return 'bg-gray-400';
    if (confidence > 0.8) return 'bg-green-500';
    if (confidence > 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Display a message for the demonstration
  return (
    <Card className="bg-white/90 backdrop-blur-md border-none shadow-lg">
      <CardContent className="pt-6 px-4">
        <div className="p-3 bg-red-50 rounded-md flex items-start gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <p className="font-semibold">Demo Mode Limitations</p>
            <p>
              The current implementation uses simulated data and cannot accurately detect emotions.
              For real emotion detection, you need to implement a machine learning model.
            </p>
          </div>
        </div>
        
        <div className="border border-gray-200 p-4 rounded-md mb-4">
          <h3 className="text-lg font-semibold mb-2">Recommended Solutions</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Brain className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">TensorFlow.js with Face-API.js</p>
                <p className="text-sm text-gray-600">
                  Provides pre-trained models for accurate face detection and emotion recognition directly in the browser.
                </p>
                <a 
                  href="https://github.com/justadudewhohacks/face-api.js" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Learn more →
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Brain className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Hugging Face Transformers</p>
                <p className="text-sm text-gray-600">
                  Access to state-of-the-art emotion recognition models that work in the browser.
                </p>
                <a 
                  href="https://huggingface.co/docs/transformers.js/index" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {emotion === 'no-face' || !faceDetected ? (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gray-200">
                <UserX className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="font-semibold">No Face Detected</h3>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "p-2 rounded-full",
                getBgColor(emotion)
              )}>
                {getEmotionIcon(emotion)}
              </div>
              <h3 className="font-semibold capitalize">{emotion}</h3>
            </div>
            <span className="text-sm font-medium">
              {formatConfidence(confidence)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
