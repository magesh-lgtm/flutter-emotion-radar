import React, { useRef, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Upload } from "lucide-react";

interface CameraViewProps {
  onFrame: (imageData: ImageData) => void;
  hasPermission: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onFrame, hasPermission }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { toast } = useToast();
  
  const startCamera = async () => {
    if (!hasPermission) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },  // Reduced size for better performance
          height: { ideal: 480 }, // Maintain aspect ratio
          facingMode: facingMode,
          frameRate: { ideal: 30 }
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
      const errorMessage = (err as Error).name === 'NotReadableError' 
        ? "Could not access your camera. Please make sure no other app is using it."
        : "Could not access the camera. Please check your browser settings.";
      
      toast({
        title: "Camera Error",
        description: errorMessage,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Stop camera if it's active
    stopCamera();

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return;

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        context.drawImage(img, 0, 0);

        // Display the image in the video element
        if (videoRef.current) {
          videoRef.current.style.display = 'none';
        }
        canvas.style.display = 'block';
        canvas.className = 'h-full w-full object-cover absolute inset-0';

        // Get image data and process
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        onFrame(imageData);

        // Process the image multiple times to ensure detection
        const processImage = () => {
          onFrame(imageData);
        };

        // Process a few times with delay to ensure model has time to detect
        setTimeout(processImage, 500);
        setTimeout(processImage, 1000);
        setTimeout(processImage, 1500);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset file input
    event.target.value = '';
  };
  
  const captureFrame = () => {
    if (!canvasRef.current || !videoRef.current || !isCameraActive) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!context) return;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    
    // Set canvas size to match video but scaled down for better performance
    const scale = 0.5; // Scale down to 50%
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    
    // Draw the video frame to canvas with scaling
    context.drawImage(
      video, 
      0, 0, video.videoWidth, video.videoHeight,
      0, 0, canvas.width, canvas.height
    );
    
    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      onFrame(imageData);
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
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
    let lastProcessTime = 0;
    const minProcessInterval = 100; // Minimum time between processing frames (ms)
    
    const processFrames = (timestamp: number) => {
      if (timestamp - lastProcessTime >= minProcessInterval) {
        captureFrame();
        lastProcessTime = timestamp;
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
      
      {!isCameraActive && !canvasRef.current?.style.display && (
        <div className="camera-placeholder absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-white opacity-50" />
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />
      
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <Button 
          size="icon"
          variant="secondary"
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button 
          size="icon"
          variant="secondary"
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"
          onClick={() => {
            if (canvasRef.current) {
              canvasRef.current.style.display = 'none';
            }
            if (videoRef.current) {
              videoRef.current.style.display = 'block';
            }
            startCamera();
          }}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default CameraView;
