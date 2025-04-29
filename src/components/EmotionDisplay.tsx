
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
  Info
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

  // Display a special message when no face is detected
  if (emotion === 'no-face' || !faceDetected) {
    return (
      <Card className="bg-gray-100 border-none shadow-lg">
        <CardContent className="pt-6 px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gray-200">
                <UserX className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="font-semibold">No Face Detected</h3>
            </div>
            <span className="text-sm font-medium">—</span>
          </div>
          
          <Progress value={0} className="h-1.5 mt-1.5 mb-3 bg-gray-200" />
          
          <p className="text-sm text-gray-600 mt-2">
            {getEmotionDescription('no-face')}
          </p>
          
          <div className="mt-3 p-2 bg-blue-50 rounded-md flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              This is a demonstration using simulated data. For accurate emotion detection, 
              a real ML model like TensorFlow.js with a pre-trained facial emotion recognition model is needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
          <span className="text-sm font-medium">
            {formatConfidence(confidence)}
          </span>
        </div>
        
        <Progress 
          value={confidence * 100} 
          className={cn("h-1.5 mt-1.5 mb-3", getProgressColor(confidence, true))}
        />
        
        <p className="text-sm text-gray-600 mt-2">
          {getEmotionDescription(emotion)}
        </p>
        
        <div className="mt-3 p-2 bg-amber-50 rounded-md flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Demo mode: This app is currently using simulated emotion detection. 
            Results do not reflect actual facial analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
