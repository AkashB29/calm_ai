"use client";
import { useEffect, useRef, useState } from "react";

export const useFaceStress = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceStress, setFaceStress] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadModels = async () => {
    const faceapi = await import("face-api.js");
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    setModelsLoaded(true);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      console.log("Camera not available:", err);
    }
  };

  const analyzeFace = async () => {
    if (!videoRef.current || !cameraReady || !modelsLoaded) return;

    const faceapi = await import("face-api.js");
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) return;

    const expr = detection.expressions;

    // Calculate stress from expressions
    const stress = Math.round(
      expr.fearful * 100 +
        expr.angry * 80 +
        expr.sad * 60 +
        expr.surprised * 40 +
        expr.disgusted * 30,
    );

    setFaceStress(Math.min(stress, 100));
  };

  useEffect(() => {
    loadModels();
    startCamera();
  }, []);

  useEffect(() => {
    if (!cameraReady || !modelsLoaded) return;
    const interval = setInterval(analyzeFace, 2000);
    return () => clearInterval(interval);
  }, [cameraReady, modelsLoaded]);

  return { videoRef, faceStress, cameraReady, modelsLoaded };
};
