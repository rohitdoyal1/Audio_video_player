import React, { useState, useEffect, useRef } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [recorder, setRecorder] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const canvasRef = useRef(null);
  let animationId;

  useEffect(() => {
    if (recorder === null && recording) {
      startRecording();
    } else if (recorder && !recording) {
      stopRecording();
    }
  }, [recording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(audioContext);

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    mediaRecorder.ondataavailable = (e) => {
      const url = URL.createObjectURL(e.data);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);

    visualize(analyser);
  };

  const stopRecording = () => {
    recorder.stop();
    setRecorder(null);
    cancelAnimationFrame(animationId); // Stop the waveform animation
  };

  const visualize = (analyser) => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = () => {
      animationId = requestAnimationFrame(drawWaveform);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid-like background
      canvasCtx.fillStyle = "#F0F0F0"; // Background color
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      canvasCtx.strokeStyle = "#E0E0E0"; // Grid color
      const gridSize = 25; // Grid size in pixels
      for (let x = 0; x < canvas.width; x += gridSize) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(x, 0);
        canvasCtx.lineTo(x, canvas.height);
        canvasCtx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, y);
        canvasCtx.lineTo(canvas.width, y);
        canvasCtx.stroke();
      }

      // Create gradient for waveform
      const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#4A90E2"); // Lighter blue
      gradient.addColorStop(1, "#002F6C"); // Darker blue

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = gradient;

      canvasCtx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    drawWaveform();
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setRecording(!recording)}
        className="bg-red-500 text-white p-2 rounded"
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <audio className="mt-4" controls src={audioURL}></audio>
      )}

    
      {recording && (
        <div className="mt-4">
          <canvas
            ref={canvasRef}
            width="400"
            height="100" // Adjust height for the waveform appearance
            className="border border-gray-300 rounded shadow-lg"
          ></canvas>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
