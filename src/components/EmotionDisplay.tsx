
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
  Star
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
            <p>Detecting emotion...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { emotion, confidence } = detectedEmotion;
  
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
    };
    
    return colors[emotion];
  };
  
  // Color for the confidence progress bar
  const getProgressColor = (confidence: number) => {
    if (confidence > 0.8) return 'bg-green-500';
    if (confidence > 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
  return (
    <Card className={cn(
      "bg-white/90 backdrop-blur-md border-none shadow-lg emotion-badge",
      "hover:scale-105 transition-transform"
    )}>
      <CardContent className="pt-6">
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
          <span className="text-sm font-medium">{formatConfidence(confidence)}</span>
        </div>
        
        <Progress 
          value={confidence * 100} 
          className="h-1.5 mt-1.5 mb-3"
          indicatorClassName={getProgressColor(confidence)}
        />
        
        <p className="text-sm text-gray-600 mt-2">
          {getEmotionDescription(emotion)}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
