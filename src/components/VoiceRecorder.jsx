import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';

const VoiceRecorder = ({setFormData}) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);

  const router = useRouter()

  // Initialize audio context and analyzer
  const initAudioAnalyzer = async () => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 32;
  };

  // Start recording
  const startRecording = async () => {
    try {
      await initAudioAnalyzer();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      // Connect audio stream to analyzer
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        setRecordedAudio(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Store in localStorage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          localStorage.setItem('recordedAudio', reader.result);
          setFormData((prev) => ({
            ...prev,
            doctorDetails: {
              ...prev.doctorDetails,
              voiceBlob: reader.result,
            },
          }));
          router.push('/preview')
        };
        
        audioChunks.current = [];
      };
      
      mediaRecorder.current.start();
      setRecording(true);
      setTimeLeft(20);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Start animation for waveform
      visualizeWaveform();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
      
      // Stop all tracks
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Visualize waveform
  const visualizeWaveform = () => {
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);
      setAudioData(new Uint8Array(dataArray));
    };
    
    draw();
  };

  // Play recorded audio
  const playRecordedAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Download recorded audio
  const downloadAudio = () => {
    if (recordedAudio) {
      saveAs(recordedAudio, 'recording.mp3');
    }
  };

  // Load audio from localStorage
  const loadAudioFromStorage = () => {
    const audioDataUrl = localStorage.getItem('recordedAudio');
    if (audioDataUrl) {
      setAudioURL(audioDataUrl);
      fetch(audioDataUrl)
        .then(res => res.blob())
        .then(blob => {
          setRecordedAudio(blob);
        });
    }
  };

  useEffect(() => {
    loadAudioFromStorage();
    
    return () => {
      if (mediaRecorder.current && recording) {
        mediaRecorder.current.stop();
      }
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="audio-recorder">
      <h2>Audio Recorder</h2>
      
      {!recording && !recordedAudio && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      
      {recording && (
        <div className="recording-container">
          <div className="waveform">
            {Array.from(audioData).map((value, index) => (
              <div 
                key={index}
                className="wave-bar"
                style={{ height: `${value / 2}px` }}
              />
            ))}
          </div>
          <p className='text-white'>Time left: {timeLeft}s</p>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      )}
      
      {recordedAudio && (
        <div className="playback-container">
          <h3>Recorded Audio</h3>
          <button onClick={playRecordedAudio}>Play</button>
          <button onClick={downloadAudio}>Download MP3</button>
          <button onClick={() => {
            setRecordedAudio(null);
            setAudioURL('');
            localStorage.removeItem('recordedAudio');
          }}>Record Again</button>
        </div>
      )}
      
      <style jsx>{`
        .audio-recorder {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        
        button {
          padding: 10px 15px;
          margin: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        
        button:hover {
          background: #0056b3;
        }
        
        .recording-container {
          margin: 20px 0;
        }
        
        .waveform {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;
          margin: 20px 0;
        }
        
        .wave-bar {
          width: 2px;
          background: #007bff;
          margin: 0 1px;
          transition: height 0.1s;
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;