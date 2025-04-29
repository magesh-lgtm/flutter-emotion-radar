
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
        <p className="text-muted-foreground">Real-time facial emotion detection</p>
      </header>
      
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">
        <div className="w-full max-w-md mb-8">
          <EmotionDetector />
        </div>
        
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about">How It Works</TabsTrigger>
            <TabsTrigger value="limitations">Limitations</TabsTrigger>
            <TabsTrigger value="alternatives">Better Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-secondary">About This Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Emotion Radar uses your device's camera to analyze facial expressions in real-time.
                  <strong className="block mt-2">Note: This is a demonstration using simulated emotion detection.</strong>
                  In a production application, this would be powered by a machine learning model like TensorFlow.js
                  with a pre-trained facial emotion recognition model.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="limitations">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-secondary flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Current Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                  <li>
                    <strong>Simulated Detection:</strong> This demo uses a randomized simulation instead of real AI.
                  </li>
                  <li>
                    <strong>Face Detection:</strong> The current method for detecting faces is based on simple image 
                    analysis, not actual face detection algorithms.
                  </li>
                  <li>
                    <strong>Browser Limitations:</strong> Browser-based facial emotion recognition has performance 
                    constraints compared to native applications.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alternatives">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-secondary flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Better Emotion Detection Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-4">
                  <div className="p-3 bg-green-50 rounded-md">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-600" />
                      TensorFlow.js with Face-API.js
                    </h3>
                    <p>
                      The most popular solution for browser-based emotion detection. Provides pre-trained models 
                      for face detection and emotion recognition.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      @huggingface/transformers
                    </h3>
                    <p>
                      Access to state-of-the-art ML models in your browser, including those for facial emotion recognition.
                      More accurate but requires more resources.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-md">
                    <h3 className="font-medium mb-1">Third-Party APIs</h3>
                    <p>
                      Services like Microsoft Azure Cognitive Services, Google Cloud Vision API, and Amazon Rekognition
                      provide powerful emotion detection but require backend integration.
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
