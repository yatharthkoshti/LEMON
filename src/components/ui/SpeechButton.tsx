import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking } from '../../utils/speech';
import { useAppStore } from '../../store/useAppStore';

interface SpeechButtonProps {
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({
  textToSpeak,
  label,
  size = 'md',
  className = ''
}) => {
  const [playing, setPlaying] = useState(false);
  const { language } = useAppStore();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing || isSpeaking()) {
      stopSpeaking();
      setPlaying(false);
    } else {
      speakText(textToSpeak, language);
      setPlaying(true);
      // Auto-reset state when utterance completes
      const checkInterval = setInterval(() => {
        if (!isSpeaking()) {
          setPlaying(false);
          clearInterval(checkInterval);
        }
      }, 500);
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  }[size];

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center rounded-full font-bold transition-all duration-200 border ${
        playing
          ? 'bg-accent text-primary border-primary animate-pulse shadow-accent'
          : 'bg-amber-50 text-amber-900 border-accent/60 hover:bg-accent/20 active:bg-accent/30'
      } ${sizeClasses} ${className}`}
      title="ઓડિયો સાંભળો (Listen Audio)"
    >
      {playing ? (
        <>
          <VolumeX className="w-4 h-4 text-primary shrink-0 animate-bounce" />
          <span className="font-semibold">{label || 'બંધ કરો (Stop)'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-amber-800 shrink-0" />
          <span className="font-semibold">{label || 'સાંભળો (Audio)'}</span>
        </>
      )}
    </button>
  );
};
