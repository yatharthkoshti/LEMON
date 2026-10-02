export function speakText(text: string, lang: 'gu' | 'hi' | 'en' = 'gu'): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any current speaking
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  if (lang === 'gu') {
    utterance.lang = 'gu-IN';
  } else if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // Slightly slower, clear pace for working class accessibility
  utterance.pitch = 1.0;

  // Find suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(lang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
