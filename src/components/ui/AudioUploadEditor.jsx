import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPlay,
  FaPause,
  FaStop,
  FaUpload,
  FaTrashAlt,
  FaSyncAlt,
  FaSave,
  FaVolumeUp,
  FaFileAudio,
  FaCheck,
  FaTimes,
  FaRedo,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";

const ALLOWED_FILE_TYPES = [
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/aac",
  "audio/webm",
  "audio/flac",
  "audio/mp3",
];

const AudioUploadEditor = ({ setAudioUploadStatus, formData, setFormData }) => {
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [mode, setMode] = useState("upload");
  const [audio, setAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filename, setFilename] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [volume, setVolume] = useState(1);
  const [recordingError, setRecordingError] = useState("");
  const [isRecordingSupported, setIsRecordingSupported] = useState(true);
  const recordingTimerRef = useRef(null);
  const MAX_RECORDING_TIME = 120; // 2 minutes

  // Check if recording is supported
  useEffect(() => {
    const checkRecordingSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsRecordingSupported(false);
        setRecordingError(
          "Recording not supported: This browser doesn't support audio recording or you're not on HTTPS/localhost",
        );
        return false;
      }

      if (!window.MediaRecorder) {
        setIsRecordingSupported(false);
        setRecordingError(
          "Recording not supported: MediaRecorder API not available",
        );
        return false;
      }

      // Check if we're in a secure context
      if (!window.isSecureContext) {
        setIsRecordingSupported(false);
        setRecordingError("Recording requires HTTPS or localhost");
        return false;
      }

      return true;
    };

    checkRecordingSupport();
  }, []);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error("Error stopping MediaRecorder on unmount:", error);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (unsavedChanges) {
      setAudioUploadStatus && setAudioUploadStatus(false);
    }
  }, [unsavedChanges, setAudioUploadStatus]);

  // Audio visualization
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#374151";
    ctx.fillRect(0, 0, width, height);

    if (isRecording) {
      // Animated waveform during recording
      const bars = 50;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * height * 0.8 + height * 0.1;
        const opacity = Math.random() * 0.8 + 0.2;

        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.fillRect(
          i * barWidth,
          (height - barHeight) / 2,
          barWidth - 1,
          barHeight,
        );
      }
    } else if (audio && isPlaying) {
      // Static waveform when playing
      const bars = 50;
      const barWidth = width / bars;
      const progress = currentTime / duration;

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * height * 0.6 + height * 0.2;
        const isActive = i < bars * progress;

        ctx.fillStyle = isActive ? "#3b82f6" : "#6b7280";
        ctx.fillRect(
          i * barWidth,
          (height - barHeight) / 2,
          barWidth - 1,
          barHeight,
        );
      }
    }
  };

  useEffect(() => {
    const animate = () => {
      drawWaveform();
      if (isRecording || isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isRecording || isPlaying) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPlaying, currentTime, duration]);

  // Recording functions with improved error handling
  const startRecording = async () => {
    try {
      setRecordingError("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "getUserMedia is not supported in this browser or context",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        console.warn("audio/webm not supported, falling back to default");
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : undefined,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setAudio({ src: url, type: mimeType });
          setFilename(`recording-${Date.now()}.webm`);
          setUnsavedChanges(true);
        } catch (error) {
          console.error("Error handling recording stop:", error);
          setRecordingError("Failed to process recording.");
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        setRecordingError(`Recording error: ${event.error.message}`);
        stopRecording();
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer after mediaRecorder has actually started
      setTimeout(() => {
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= MAX_RECORDING_TIME) {
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
      }, 0);
    } catch (error) {
      console.error("Error accessing microphone:", error);

      let errorMessage = "Failed to access microphone. ";

      if (error.name === "NotAllowedError") {
        errorMessage += "Permission denied. Please allow microphone access.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No microphone found.";
      } else if (error.name === "NotSupportedError") {
        errorMessage += "Recording not supported in this browser.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Microphone is already in use.";
      } else {
        errorMessage += error.message;
      }

      setRecordingError(errorMessage);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (!isRecording) {
      console.warn("Recording already stopped.");
      return;
    }

    setIsRecording(false);

    // Clear timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Stop recorder if active
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Error stopping MediaRecorder:", error);
      }
    }

    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // File upload
  const onUpload = () => {
    inputRef.current?.click();
  };

  const onLoadAudio = (event) => {
    const file = event.target.files?.[0];
    if (file && ALLOWED_FILE_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file);
      setAudio({ src: url, type: file.type });
      setFilename(file.name);
      setUnsavedChanges(true);
    } else {
      alert("Please upload a valid audio file (MP3, WAV, OGG, etc.)");
    }
    event.target.value = "";
  };

  // Audio playback controls
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleAudioLoad = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Utility functions
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetAudio = () => {
    if (audio?.src) URL.revokeObjectURL(audio.src);
    setAudio(null);
    setFilename("");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setUnsavedChanges(false);
  };

  const saveAudio = () => {
    if (audio && setFormData) {
      setFormData((prev) => ({
        ...prev,
        audio: audio.src,
        audioType: audio.type,
        audioFilename: filename,
      }));
    }
    setUnsavedChanges(false);
    console.log("Audio saved successfully!");
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 max-w-3xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-white mb-6">
        Audio Upload & Editor
      </h2>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={onLoadAudio}
        className="hidden"
      />

      {/* Mode Selection */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === "upload"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <FaUpload /> Upload Audio
          </button>
          <button
            type="button"
            onClick={() => setMode("record")}
            disabled={!isRecordingSupported}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === "record"
                ? "bg-blue-600 text-white"
                : !isRecordingSupported
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <FaMicrophone /> Record Audio
          </button>
        </div>
      </div>

      {/* Recording Error Display */}
      {recordingError && (
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-6 flex items-start gap-3">
          <FaExclamationTriangle className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-medium mb-1">Recording Error</h3>
            <p className="text-red-300 text-sm">{recordingError}</p>
            {!window.isSecureContext && (
              <p className="text-red-300 text-xs mt-2">
                Try accessing this page via HTTPS or localhost for recording to
                work.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && !audio && (
        <div
          className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 text-center h-80 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
          onClick={onUpload}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && ALLOWED_FILE_TYPES.includes(file.type)) {
              const fakeEvent = {
                target: { files: [file] },
                preventDefault: () => {},
              };
              onLoadAudio(fakeEvent);
            }
          }}
        >
          <div className="text-gray-400 mb-4 bg-gray-800 p-4 rounded-full">
            <FaFileAudio size={48} />
          </div>
          <p className="text-gray-300 mb-4 text-lg">
            Drag and drop your audio file here, or click to browse
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Supported formats: MP3, WAV, OGG, AAC, WEBM, FLAC
          </p>
        </div>
      )}

      {/* Record Mode */}
      {mode === "record" && (
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-6 z-30">
            <div className="relative inline-flex items-center justify-center">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isRecordingSupported}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 ${
                  !isRecordingSupported
                    ? "bg-gray-600 cursor-not-allowed"
                    : isRecording
                      ? "bg-red-600 hover:bg-red-700 animate-pulse"
                      : "bg-blue-600 hover:bg-blue-700"
                }`}
                style={{
                  zIndex: 2,
                }}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
              {isRecording && (
                <div
                  className="absolute -inset-4 border-4 border-red-400 rounded-full animate-ping opacity-30"
                  style={{
                    zIndex: 1,
                  }}
                ></div>
              )}
            </div>
            <p className="text-gray-300 mt-4 text-lg">
              {!isRecordingSupported
                ? "Recording not available"
                : isRecording
                  ? "Recording..."
                  : "Click to start recording"}
            </p>
            {isRecording && (
              <p className="text-red-400 mt-2">
                {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
              </p>
            )}
          </div>

          {/* Waveform visualization */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={80}
              className="w-full h-20 rounded"
            />
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audio && (
        <div className="space-y-4 mt-6">
          <audio
            ref={audioRef}
            src={audio.src}
            onLoadedMetadata={handleAudioLoad}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => console.error("Audio error:", e)}
          />

          {/* Controls */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                    }
                  }}
                  className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-white transition-colors"
                  title="Restart"
                >
                  <FaRedo size={20} />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetAudio}
                  className="bg-red-600 hover:bg-red-700 p-3 rounded-lg text-white transition-colors"
                  title="Remove Audio"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-400 text-sm mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-3">
              <FaVolumeUp className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-400 text-sm w-12">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* File info and save */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-2 md:mb-0">
              <p className="text-sm text-gray-400">Filename: {filename}</p>
              <p className="text-sm text-gray-400">
                Duration: {formatTime(duration)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={saveAudio}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                <FaSave /> Save Audio
              </button>
              {unsavedChanges && (
                <span className="text-yellow-400 text-sm">Unsaved Changes</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audio Requirements */}
      <div className="mt-8 text-gray-400 text-sm">
        <h3 className="text-white text-lg font-medium mb-2">
          Audio Requirements
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Upload clear, high-quality audio recordings</li>
          <li>Minimum duration: 10 seconds for voice cloning</li>
          <li>Recommended: 30 seconds to 2 minutes for best results</li>
          <li>Avoid background noise and echo</li>
          <li>Speak clearly and at a consistent volume</li>
          <li>Supported formats: MP3, WAV, OGG, AAC, WEBM, FLAC</li>
          <li>Recording requires HTTPS or localhost access</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioUploadEditor;
