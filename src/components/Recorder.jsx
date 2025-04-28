"use client";

import React, { useState, useRef, useEffect } from 'react';
import Loader from './Waves';

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const MAX_RECORDING_TIME = 20; // seconds

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setRecordedBlob(blob);
      };

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev + 1 >= MAX_RECORDING_TIME) {
            stopRecording();
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev + 1 >= MAX_RECORDING_TIME) {
            stopRecording();
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const resetRecording = () => {
    setAudioURL('');
    setRecordedBlob(null);
    setSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Recorder (Max 20 seconds)</h1>

      {!isRecording && !audioURL && (
        <button onClick={startRecording} className="bg-green-500 text-white px-4 py-2 rounded">
          Start Recording
        </button>
      )}

      {isRecording && (
        <div className="flex flex-col items-center gap-4">
          <Loader/>
          <div className="text-3xl font-bold">{seconds}s</div>

          <div className="flex gap-4">
            {!isPaused ? (
              <button onClick={pauseRecording} className="bg-yellow-500 text-white px-4 py-2 rounded">
                Pause
              </button>
            ) : (
              <button onClick={resumeRecording} className="bg-blue-500 text-white px-4 py-2 rounded">
                Resume
              </button>
            )}
            <button onClick={stopRecording} className="bg-red-500 text-white px-4 py-2 rounded">
              Stop
            </button>
          </div>
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="mt-6">
          <audio controls src={audioURL} className="w-full" />
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                resetRecording();
                startRecording();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Record Again
            </button>
            <a
              href={audioURL}
              download="recording.webm"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
