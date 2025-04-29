
import React, { useState, useEffect } from 'react';
import CameraView from './CameraView';
import EmotionDisplay from './EmotionDisplay';
import PermissionRequest from './PermissionRequest';
import { EmotionResult } from '@/utils/faceApiUtils';
import { loadFaceApiModels, detectFaceEmotions, mapFaceApiEmotionToAppEmotion } from '@/utils/faceApiUtils';
import { useToast } from "@/hooks/use-toast";

const EmotionDetector: React.FC = () => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'denied' | 'granted' | 'error'>('prompt');
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { toast } = useToast();
  
  // Load Face-API.js models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      if (!modelsLoaded && !isLoadingModels) {
        setIsLoadingModels(true);
        try {
          await loadFaceApiModels();
          setModelsLoaded(true);
          toast({
            title: "Models Loaded",
            description: "Facial recognition models loaded successfully.",
          });
        } catch (error) {
          console.error("Failed to load models:", error);
          toast({
            title: "Model Loading Error",
            description: "Could not load facial recognition models. Please refresh and try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingModels(false);
        }
      }
    };
    
    loadModels();
  }, []);
  
  // Function to handle camera permission request
  const requestCameraPermission = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // If we get here, permission was granted
      setPermissionState('granted');
      
      // Clean up the stream since we don't need it yet
      result.getTracks().forEach(track => track.stop());
    } catch (error) {
      // Check if the error is a permission denied error
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
  
  // Process video frames to detect emotions using Face-API.js
  const handleVideoFrame = async (imageData: ImageData, videoElement: HTMLVideoElement) => {
    if (!modelsLoaded) {
      // Don't attempt detection until models are loaded
      setDetectedEmotion({
        emotion: 'neutral',
        confidence: 0,
        faceDetected: false,
      });
      return;
    }
    
    try {
      // Use the video element directly for face detection
      const detections = await detectFaceEmotions(videoElement);
      
      if (detections) {
        // We have a face with expressions
        const { emotion, confidence } = mapFaceApiEmotionToAppEmotion(detections.expressions);
        
        setDetectedEmotion({
          emotion,
          confidence,
          faceDetected: true
        });
      } else {
        // No face detected
        setDetectedEmotion({
          emotion: 'no-face',
          confidence: 0,
          faceDetected: false
        });
      }
    } catch (error) {
      console.error("Error analyzing frame:", error);
      // Keep the last detected emotion or set to neutral if none exists
      if (!detectedEmotion) {
        setDetectedEmotion({
          emotion: 'neutral',
          confidence: 0,
          faceDetected: false
        });
      }
    }
  };
  
  // Check initially if we already have camera permission
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Try to check permission status
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
          // If we can't query permission status, we'll have to try to access the camera
          // This will be handled when the user clicks the permission button
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
      {!modelsLoaded && (
        <div className="w-full max-w-md p-4 bg-blue-50 rounded-lg text-center mb-2">
          <p className="font-medium text-blue-700">Loading facial recognition models...</p>
          <div className="mt-2 h-1 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
      
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
