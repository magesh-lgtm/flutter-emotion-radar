
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
  Brain
} from "lucide-react";
import { 
  Emotion, 
  EmotionResult, 
  formatConfidence,
  getEmotionDescription 
} from '@/utils/emotionUtils';
import { cn } from '@/lib/utils';

interface EmotionDisplayProps {
  detectedEmotion: EmotionResult | null;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ detectedEmotion }) => {
  if (!detectedEmotion) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm text-white border-none shadow-lg">
        <CardContent className="pt-6 px-4 text-center">
          <div className="animate-pulse">
            <p>Initializing emotion detection...</p>
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

  return (
    <Card className="bg-white/90 backdrop-blur-md border-none shadow-lg">
      <CardContent className="pt-6 px-4">
        {emotion === 'no-face' || !faceDetected ? (
          <div className="flex items-center flex-col mb-4">
            <div className="p-3 rounded-full bg-gray-200 mb-2">
              <UserX className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-700 mb-1">No Face Detected</h3>
            <p className="text-sm text-gray-600 text-center">
              Please make sure your face is clearly visible in the camera.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-4">
            <div className={cn(
              "p-3 rounded-full mb-2",
              getBgColor(emotion)
            )}>
              {getEmotionIcon(emotion)}
            </div>
            <h3 className="font-bold text-lg text-gray-700 mb-1 capitalize">{emotion}</h3>
            <div className="flex items-center gap-2 w-full max-w-xs mt-2">
              <span className="text-xs font-medium w-10">0%</span>
              <Progress 
                value={confidence * 100} 
                className="h-2"
                indicatorClassName={getProgressColor(confidence, faceDetected)}
              />
              <span className="text-xs font-medium w-10">{formatConfidence(confidence)}</span>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              {getEmotionDescription(emotion)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
