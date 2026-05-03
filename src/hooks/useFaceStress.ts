"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let faceapiInstance: any = null;
async function getFaceApi() {
  if (faceapiInstance) return faceapiInstance;
  if (typeof window === "undefined") return null;
  faceapiInstance = await import("face-api.js");
  return faceapiInstance;
}

export const useFaceStress = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // ← holds the stream independently
  const activeRef = useRef(true);

  const [faceStress, setFaceStress] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadModels = async () => {
    const faceapi = await getFaceApi();
    if (!faceapi) return;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);
    setModelsLoaded(true);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
      });
      streamRef.current = stream; // ← save stream in ref immediately
      activeRef.current = true;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err) {
      console.log("Camera not available:", err);
    }
  };

  // Called imperatively from page — stops hardware, kills indicator light
  const stopCamera = useCallback(() => {
    activeRef.current = false;

    // Stop via streamRef — guaranteed to have the stream even if videoRef is null
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        t.stop(); // this is what turns the camera light off
      });
      streamRef.current = null;
    }

    // Also clear the video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  }, []);

  const analyzeFace = async () => {
    if (!activeRef.current) return;
    if (!videoRef.current || !modelsLoaded) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    const faceapi = await getFaceApi();
    if (!faceapi) return;

    const detection = await faceapi
      .detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({
          scoreThreshold: 0.4,
          inputSize: 160,
        }),
      )
      .withFaceExpressions();

    if (!activeRef.current) return; // check again after async gap
    if (!detection) return;

    const e = detection.expressions;
    const stress = Math.min(
      100,
      Math.round(
        e.fearful * 95 +
          e.angry * 85 +
          e.disgusted * 75 +
          e.sad * 70 +
          e.surprised * 55 +
          e.neutral * 5 +
          e.happy * 2,
      ),
    );
    setFaceStress(stress);
  };

  useEffect(() => {
    loadModels();
    startCamera();
    return () => {
      stopCamera(); // always kill camera on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cameraReady || !modelsLoaded) return;
    const interval = setInterval(analyzeFace, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraReady, modelsLoaded]);

  return { videoRef, faceStress, cameraReady, modelsLoaded, stopCamera };
};
