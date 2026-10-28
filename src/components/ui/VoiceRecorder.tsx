import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  initialAudioUrl?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, initialAudioUrl }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    onRecordingComplete(new Blob(), ''); // Pass empty to reset
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gray-50 rounded-3xl p-4 border border-gray-100 flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {!audioUrl ? (
          <motion.div
            key="record"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-sm font-bold text-gray-500 mb-4 h-6">
              {isRecording ? (
                <span className="text-red-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {formatTime(recordingTime)} / 02:00
                </span>
              ) : (
                <span>{t('voice_recorder.record')}</span>
              )}
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-100 text-red-500 border-4 border-red-200' 
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-current" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="playback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm"
          >
            <button
              onClick={togglePlayback}
              className="w-12 h-12 shrink-0 rounded-full bg-accent flex items-center justify-center text-primary"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            
            <div className="flex-1 flex items-center h-10 bg-gray-50 rounded-xl overflow-hidden px-2">
               {/* Waveform placeholder */}
               <div className="w-full h-4 flex items-center justify-between gap-[2px]">
                 {[...Array(30)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     className="w-1 bg-primary/20 rounded-full"
                     animate={{ height: isPlaying ? ['20%', '80%', '40%', '100%', '20%'] : '20%' }}
                     transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                   />
                 ))}
               </div>
            </div>

            <button
              onClick={deleteRecording}
              className="w-10 h-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"
              title={t('voice_recorder.delete')}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            
            <audio ref={audioRef} src={audioUrl} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
