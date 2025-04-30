
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmotionDetector from '@/components/EmotionDetector';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-50 to-white p-4">
      <header className="w-full max-w-md text-center my-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Emotion Radar</h1>
        <p className="text-muted-foreground">Real-time facial emotion detection</p>
      </header>
      
      <main className="w-full max-w-md flex-1 flex flex-col items-center">
        <EmotionDetector />
        
        <Card className="w-full mt-8 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-secondary">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Emotion Radar uses your device's camera to analyze facial expressions in real-time.
              The app identifies emotions like happiness, sadness, anger, and more.
              <br /><br />
              <span className="text-xs text-muted-foreground">
                Note: This is a demonstration using simulated emotion detection for web. 
                A full implementation would use TensorFlow Lite for accurate results.
              </span>
            </p>
          </CardContent>
        </Card>
      </main>
      
      <footer className="w-full max-w-md text-center text-xs text-gray-400 my-6">
        <p>Emotion Radar &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
