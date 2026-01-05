"use client"
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import * as cocossd from '@tensorflow-models/coco-ssd'
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { DetectedObject, ObjectDetection } from '@tensorflow-models/coco-ssd';
import { toast } from "sonner"
import { Rings } from 'react-loader-spinner';
import { beep } from '../../utils/audio'
import { drawOnCanvas } from '../../utils/draw';
import ControlPanel from '@/components/control-panel';
import DetectionLog from '@/components/detection-log';

type Props = {}

let interval: any = null;
let stopTimeout: any = null;

const HomePage = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // State
  const [mirrored, setMirrored] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);
  const [volume, setVolume] = useState(0.8);
  const [model, setModel] = useState<ObjectDetection>();
  const [loading, setLoading] = useState(false);
  
  // Detection History State
  const [history, setHistory] = useState<{ id: number; label: string; score: number; timestamp: string }[]>([]);
  const lastDetectionTimeRef = useRef<number>(0);

  // Initialize Media Recorder
  useEffect(() => {
    if (webcamRef && webcamRef.current) {
      const stream = (webcamRef.current.video as any).captureStream();
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            const recordedBlob = new Blob([e.data], { type: 'video' });
            const videoURL = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = videoURL;
            a.download = `watchtower-capture-${formatDate(new Date())}.webm`;
            a.click();
          }
        };
        
        mediaRecorderRef.current.onstart = () => setIsRecording(true);
        mediaRecorderRef.current.onstop = () => setIsRecording(false);
      }
    }
  }, [webcamRef]);

  // Load Model
  useEffect(() => {
    setLoading(true);
    initModel();
  }, []);

  async function initModel() {
    const loadedModel: ObjectDetection = await cocossd.load({
      base: 'mobilenet_v2'
    });
    setModel(loadedModel);
    setLoading(false);
  }

  // Run Prediction Loop
  useEffect(() => {
    interval = setInterval(() => {
      runPrediction();
    }, 100);
    return () => clearInterval(interval);
  }, [webcamRef.current, model, mirrored, autoRecordEnabled]);

  async function runPrediction() {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const predictions: DetectedObject[] = await model.detect(webcamRef.current.video);

      resizeCanvas(canvasRef, webcamRef);
      drawOnCanvas(mirrored, predictions, canvasRef.current?.getContext('2d'));

      let isPerson: boolean = false;
      
      if (predictions.length > 0) {
        predictions.forEach((prediction) => {
          isPerson = prediction.class === 'person';
                   
          // Update History with debounce (1 second)
          const now = Date.now();
          if (now - lastDetectionTimeRef.current > 1000) {
             lastDetectionTimeRef.current = now;
             addToHistory(prediction.class, prediction.score);
          }
        });

        if (isPerson && autoRecordEnabled) {
          startRecording(true);
        }
      }
    }
  }

  function addToHistory(label: string, score: number) {
      setHistory(prev => {
          const newEntry = {
              id: Date.now(),
              label,
              score,
              timestamp: new Date().toLocaleTimeString()
          };
          // Keep last 50 entries
          return [newEntry, ...prev].slice(0, 50);
      });
  }

  // Actions
  function userPromptScreenshot() {
    if (!webcamRef.current) {
      toast('Camera not found. Please refresh');
    } else {
      const imgSrc = webcamRef.current.getScreenshot();
      if (imgSrc) {
          const blob = base64toBlob(imgSrc);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `watchtower-snapshot-${formatDate(new Date())}.png`;
          a.click();
          toast.success('Snapshot saved!');
      }
    }
  }

  function userPromptRecord() {
    if (!webcamRef.current) return toast('Camera is not found. Please refresh.');

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.requestData();
      clearTimeout(stopTimeout);
      mediaRecorderRef.current.stop();
      toast.success('Recording saved to downloads');
    } else {
      startRecording(false);
    }
  }

  function startRecording(doBeep: boolean) {
    if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
      mediaRecorderRef.current?.start();
      doBeep && beep(volume);
      
      if(doBeep) toast.error('Person Detected! Recording started.', { className: 'bg-red-500 text-white border-none' });
      else toast.info('Recording started');

      stopTimeout = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.requestData();
          mediaRecorderRef.current.stop();
        }
      }, 30000);
    }
  }

  function toggleAutoRecord() {
    setAutoRecordEnabled(prev => {
        const next = !prev;
        toast(next ? 'Auto Record Enabled' : 'Auto Record Disabled', {
            description: next ? 'System will record when a person is detected.' : 'System is paused.' 
        });
        return next;
    });
  }

  return (
    <div className='flex h-screen w-screen overflow-hidden bg-black relative'>
      {/* Background Video Layer */}
      <div className='absolute inset-0 w-full h-full'>
          <Webcam
            ref={webcamRef}
            mirrored={mirrored}
            className='h-full w-full object-cover' 
            muted
          />
          <canvas
            ref={canvasRef}
            className='absolute top-0 left-0 h-full w-full object-cover'
          />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm'>
          <Rings height={80} width={80} color='#EF4444' />
          <p className='mt-4 text-white font-mono animate-pulse'>Initialize AI Model...</p>
        </div>
      )}

      {/* UI Overlay Layers */}
      
      {/* Top Header */}
      <div className='absolute top-6 left-6 z-40'>
        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400 drop-shadow-lg font-mono'>
            WATCHTOWER<span className="text-white text-xs align-top ml-2 bg-red-600 px-1 rounded">LIVE</span>
        </h1>
        <p className='text-white/60 text-xs font-mono tracking-widest'>SYSTEM ONLINE</p>
      </div>

      {/* Detection Log (Right Side) */}
      <DetectionLog history={history} onClear={() => setHistory([])} />

      {/* Control Panel (Bottom Center) */}
      <ControlPanel 
        isRecording={isRecording}
        autoRecordEnabled={autoRecordEnabled}
        volume={volume}
        onSnapshot={userPromptScreenshot}
        onRecord={userPromptRecord}
        onToggleAutoRecord={toggleAutoRecord}
        onFlip={() => setMirrored(prev => !prev)}
        onVolumeChange={setVolume}
      />
      
    </div>
  )
}

export default HomePage

// Helpers
function resizeCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, webcamRef: React.RefObject<Webcam>) {
  const canvas = canvasRef.current;
  const video = webcamRef.current?.video;

  if (canvas && video) {
    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
}

function formatDate(d: Date) {
  const formattedDate =
    [
      (d.getMonth() + 1).toString().padStart(2, "0"),
      d.getDate().toString().padStart(2, "0"),
      d.getFullYear(),
    ].join("-") +
    "-" +
    [
      d.getHours().toString().padStart(2, "0"),
      d.getMinutes().toString().padStart(2, "0"),
      d.getSeconds().toString().padStart(2, "0"),
    ].join("-");
  return formattedDate;
}

function base64toBlob(base64Data: any) {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteCharacters.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: "image/png" }); 
}