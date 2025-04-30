import React, { useState, useEffect } from 'react';
import CameraView from './CameraView';
import EmotionDisplay from './EmotionDisplay';
import PermissionRequest from './PermissionRequest';
import { detectEmotion, EmotionResult } from '@/utils/emotionUtils';
import { useToast } from "@/hooks/use-toast";

const EmotionDetector: React.FC = () => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'denied' | 'granted' | 'error'>('prompt');
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const { toast } = useToast();
  
  // Function to handle camera permission request
  const requestCameraPermission = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionState('granted');
      result.getTracks().forEach(track => track.stop());
    } catch (error) {
      if ((error as Error).name === 'NotAllowedError' || 
          (error as Error).name === 'PermissionDeniedError') {
        setPermissionState('denied');
        toast({
          title: "Permission Denied",
          description: "You need to allow camera access to use this feature.",
          variant: "destructive"
        });
      } else {
        console.error("Error accessing camera:", error);
        setPermissionState('error');
        toast({
          title: "Camera Error",
          description: "There was a problem accessing your camera.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Process video frames to detect emotions
  const handleVideoFrame = async (imageData: ImageData) => {
    try {
      const result = await detectEmotion(imageData);
      setDetectedEmotion(result);
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  };
  
  // Check initially if we already have camera permission
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.permissions?.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
            setPermissionState('granted');
          } else if (permissionStatus.state === 'denied') {
            setPermissionState('denied');
          } else {
            setPermissionState('prompt');
          }
          
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state as 'prompt' | 'denied' | 'granted');
          };
        })
        .catch(() => {
          // If we can't query permission status, we'll handle it when user clicks the permission button
        });
    } else {
      setPermissionState('error');
      toast({
        title: "Camera Not Supported",
        description: "Your browser or device does not support camera access.",
        variant: "destructive"
      });
    }
  }, []);
  
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {permissionState !== 'granted' ? (
        <PermissionRequest 
          onRequestPermission={requestCameraPermission} 
          permissionState={permissionState}
        />
      ) : (
        <div className="w-full max-w-md">
          <CameraView 
            onFrame={handleVideoFrame} 
            hasPermission={permissionState === 'granted'} 
          />
          
          <div className="mt-4 px-2">
            <EmotionDisplay detectedEmotion={detectedEmotion} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;
