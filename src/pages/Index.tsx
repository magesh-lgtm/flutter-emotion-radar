
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmotionDetector from '@/components/EmotionDetector';
import { AlertCircle, Brain, Code, Lightbulb } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-50 to-white p-4">
      <header className="w-full max-w-2xl text-center my-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Emotion Radar</h1>
        <p className="text-muted-foreground">Real-time facial emotion detection powered by TensorFlow.js</p>
      </header>
      
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">
        <div className="w-full max-w-md mb-8">
          <EmotionDetector />
        </div>
        
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about">How It Works</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-secondary">About Emotion Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Emotion Radar uses TensorFlow.js with Face-API.js to analyze your facial expressions in real-time,
                  providing immediate feedback about your emotional state. The application runs entirely in your
                  browser with no server-side processing of your video.
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-1">Privacy First</h3>
                  <p className="text-sm text-blue-700">
                    All processing happens locally on your device - we never store or transmit your video data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tips">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-secondary flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Tips for Better Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-3 list-disc pl-5">
                  <li>
                    <strong>Good Lighting:</strong> Make sure your face is well-lit from the front.
                    Avoid backlighting that puts your face in shadow.
                  </li>
                  <li>
                    <strong>Face Positioning:</strong> Center your face in the frame and look directly 
                    at the camera.
                  </li>
                  <li>
                    <strong>Minimize Movement:</strong> Sudden movements can temporarily reduce accuracy.
                  </li>
                  <li>
                    <strong>Clear Face:</strong> Remove obstacles like masks, sunglasses, or hands 
                    covering parts of your face.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tech">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-secondary flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-4">
                  <div className="p-3 bg-green-50 rounded-md">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-600" />
                      TensorFlow.js
                    </h3>
                    <p>
                      A machine learning library that enables training and deploying ML models in the browser.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      Face-API.js
                    </h3>
                    <p>
                      Built on TensorFlow.js, Face-API.js provides pre-trained models for face detection,
                      facial landmark detection, and expression recognition.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-md">
                    <h3 className="font-medium mb-1">How It Works</h3>
                    <p>
                      The app captures frames from your camera, processes them through the TinyFaceDetector model
                      to find faces, then analyzes facial expressions using a combination of facial landmarks and
                      an expression recognition model.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="w-full max-w-2xl text-center text-xs text-gray-400 my-6">
        <p>Emotion Radar &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
