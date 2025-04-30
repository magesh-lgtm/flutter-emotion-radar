import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
  
  const { emotion } = detectedEmotion;
  
  // Get the appropriate icon for each emotion
  const getEmotionIcon = (emotion: Emotion) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="h-8 w-8 text-emotion-vivid-happy" />;
      case 'sad':
        return <Frown className="h-8 w-8 text-emotion-vivid-sad" />;
      case 'angry':
        return <AlertTriangle className="h-8 w-8 text-emotion-vivid-angry" />;
      case 'surprised':
        return <Star className="h-8 w-8 text-emotion-vivid-surprised" />;
      case 'fearful':
        return <AlertCircle className="h-8 w-8 text-emotion-vivid-fearful" />;
      case 'disgusted':
        return <ThumbsDown className="h-8 w-8 text-emotion-vivid-disgusted" />;
      case 'neutral':
        return <Meh className="h-8 w-8 text-emotion-vivid-neutral" />;
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
  
  return (
    <Card className={cn(
      "bg-white/90 backdrop-blur-md border-none shadow-lg emotion-badge",
      "hover:scale-105 transition-transform"
    )}>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className={cn(
            "p-3 rounded-full mb-3",
            getBgColor(emotion)
          )}>
            {getEmotionIcon(emotion)}
          </div>
          <h3 className="text-xl font-semibold capitalize mb-2">{emotion}</h3>
          <p className="text-sm text-gray-600">
            {getEmotionDescription(emotion)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
