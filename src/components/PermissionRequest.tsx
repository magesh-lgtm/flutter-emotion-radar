
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PermissionRequestProps {
  onRequestPermission: () => void;
  permissionState: 'prompt' | 'denied' | 'granted' | 'error';
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({ 
  onRequestPermission,
  permissionState 
}) => {
  const handlePermissionRequest = () => {
    onRequestPermission();
    
    if (permissionState === 'denied') {
      toast("Camera permission denied", {
        description: "Please enable camera access in your browser settings.",
        action: {
          label: "OK",
          onClick: () => console.log("Acknowledged")
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Camera Access Required</CardTitle>
          <CardDescription>
            We need your camera to detect emotions in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Camera className="w-10 h-10 text-primary" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            onClick={handlePermissionRequest}
            disabled={permissionState === 'error'}
          >
            {permissionState === 'denied' ? 'Try Again' : 'Enable Camera'}
          </Button>
          {permissionState === 'denied' && (
            <p className="text-sm text-red-500">
              Camera access was denied. Please check your browser settings.
            </p>
          )}
          {permissionState === 'error' && (
            <p className="text-sm text-red-500">
              Error accessing camera. Your device might not support this feature.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PermissionRequest;
