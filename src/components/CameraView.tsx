
import React, { useRef, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";

interface CameraViewProps {
  onFrame: (imageData: ImageData) => void;
  hasPermission: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onFrame, hasPermission }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { toast } = useToast();
  
  const startCamera = async () => {
    if (!hasPermission) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 480 },
          height: { ideal: 640 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsCameraActive(true);
          }
        };
      }
    } catch (err) {
      console.error("Error starting camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access the camera.",
        variant: "destructive"
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };
  
  const captureFrame = () => {
    if (!canvasRef.current || !videoRef.current || !isCameraActive) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!context) return;
    
    // Make sure video has valid dimensions before drawing to canvas
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Extract image data for processing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    onFrame(imageData);
  };
  
  useEffect(() => {
    if (hasPermission) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [hasPermission, facingMode]);
  
  useEffect(() => {
    let frameId: number;
    let frameCounter = 0;
    
    const processFrames = () => {
      frameCounter++;
      
      // Process every 3rd frame to reduce CPU usage and simulate processing time
      if (frameCounter % 3 === 0) {
        captureFrame();
      }
      
      frameId = requestAnimationFrame(processFrames);
    };
    
    if (isCameraActive) {
      frameId = requestAnimationFrame(processFrames);
    }
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isCameraActive]);
  
  return (
    <div className="camera-container relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
      <video 
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
      />
      
      {!isCameraActive && (
        <div className="camera-placeholder absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-white opacity-50" />
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />
      
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          size="icon"
          variant="secondary"
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"
          onClick={toggleCamera}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CameraView;
