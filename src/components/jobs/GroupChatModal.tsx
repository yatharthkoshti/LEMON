import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, X, Send, Mic, Play, Pause, Phone, 
  Clock, Shield, User, Volume2, MessageSquare, ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job, ChatMessage } from '../../types';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { uploadMediaToS3 } from '../../utils/s3Upload';

interface GroupChatModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({ job, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { profile, posterProfile, currentPortal, chatMessages, sendChatMessage, showToast } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'chat' | 'members'>('chat');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  if (!job) return null;

  const currentUserName = currentPortal === 'job_poster' ? (posterProfile.name || 'Job Poster') : profile.name;
  const currentUserPhone = currentPortal === 'job_poster' ? (posterProfile.phone || 'Poster Contact') : profile.phone;
  const currentUserId = currentPortal === 'job_poster' ? posterProfile.id : profile.id;

  // Filter messages for this job
  const jobMessages = chatMessages.filter(m => m.jobId === job.id);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat' && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [jobMessages.length, activeTab, isOpen]);

  // Handle Text Send
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) return;

    sendChatMessage({
      jobId: job.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderPhone: currentUserPhone,
      type: 'text',
      content: textInput.trim()
    });
    setTextInput('');
  };

  // Start Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const s3Url = await uploadMediaToS3(audioBlob, 'chats');
        sendChatMessage({
          jobId: job.id,
          senderId: currentUserId,
          senderName: currentUserName,
          senderPhone: currentUserPhone,
          type: 'voice',
          content: s3Url
        });
        stream.getTracks().forEach(track => track.stop());
        showToast('વોઇસ મેસેજ મોકલાઈ ગયો (Voice Note Sent)', 'success');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast('Microphone access denied', 'error');
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Play audio message
  const handlePlayVoice = (id: string, url: string) => {
    if (playingMessageId === id) {
      audioElementRef.current?.pause();
      setPlayingMessageId(null);
      return;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(url);
    audioElementRef.current = audio;
    audio.play();
    setPlayingMessageId(id);

    audio.onended = () => {
      setPlayingMessageId(null);
    };
  };

  // Assigned members list
  const allParticipants = [
    {
      id: job.posterId,
      name: `${job.company} (${job.posterType === 'individual' ? 'માલિક' : 'કોન્ટ્રાક્ટર'})`,
      phone: posterProfile.phone || '98250 12345',
      role: 'Job Poster / સાઇટ ઇન્ચાર્જ'
    },
    ...job.assignedWorkers.map((w, index) => ({
      id: w.workerId,
      name: w.workerName,
      phone: w.phone || `98250 ${11000 + index * 111}`,
      role: w.skills.join(', ') || 'શ્રમિક (Worker)'
    }))
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative w-full max-w-lg bg-card sm:rounded-3xl shadow-soft-lg border border-gray-100 z-10 h-full sm:h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Group Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-1 rounded-xl text-white/80 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">⚡</span>
                    <h3 className="font-heading text-lg leading-tight truncate max-w-[220px]">
                      {job.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-accent font-semibold flex items-center gap-1">
                    <span>{allParticipants.length} સભ્યો (Members)</span>
                    <span>•</span>
                    <span>કામ પૂરું થાય ત્યાં સુધી સક્રિય</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab(activeTab === 'chat' ? 'members' : 'chat')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'members' 
                      ? 'bg-accent text-primary' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  {activeTab === 'members' ? 'ચેટ (Chat)' : 'સભ્યો (Members)'}
                </button>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/80">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Temporary Group Notice Banner */}
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900 font-semibold shrink-0">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                આ ગ્રૂપ કામ ચાલુ હોય ત્યાં સુધી જ ઉપલબ્ધ રહેશે.
              </span>
              <span className="text-[10px] font-bold bg-amber-200/80 px-2 py-0.5 rounded-full">
                Auto-delete
              </span>
            </div>

            {/* Body: Members View vs Chat View */}
            {activeTab === 'members' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-secondary tracking-wider mb-2">
                  સંપર્ક નંબર યાદી (Contact Numbers for Job Coordination)
                </h4>
                {allParticipants.map((participant, idx) => (
                  <div 
                    key={participant.id + idx}
                    className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-bold text-primary">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm leading-tight">{participant.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{participant.role}</p>
                        <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {participant.phone}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${participant.phone}`}
                      className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                      title="Direct Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {jobMessages.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 space-y-2">
                    <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="text-sm font-semibold">નવો મેસેજ અથવા વોઇસ નોટ મોકલો.</p>
                    <p className="text-xs text-gray-400">All workers and poster can communicate here.</p>
                  </div>
                ) : (
                  jobMessages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] font-bold text-gray-600">{msg.senderName}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({msg.senderPhone})</span>
                        </div>

                        <div 
                          className={`max-w-[85%] rounded-2xl p-3 shadow-2xs ${
                            isMe 
                              ? 'bg-primary text-white rounded-tr-xs' 
                              : 'bg-white text-primary border border-gray-100 rounded-tl-xs'
                          }`}
                        >
                          {msg.type === 'text' ? (
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          ) : (
                            <div className="flex items-center gap-3 py-1">
                              <button
                                onClick={() => handlePlayVoice(msg.id, msg.content)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                  isMe ? 'bg-accent text-primary' : 'bg-primary text-white'
                                }`}
                              >
                                {playingMessageId === msg.id ? (
                                  <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                  <Play className="w-4 h-4 fill-current ml-0.5" />
                                )}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center gap-1">
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span className="text-xs font-bold">ઓડિયો મેસેજ (Voice Note)</span>
                                </div>
                                <div className="h-1 bg-white/30 rounded-full mt-1.5 overflow-hidden">
                                  <div className={`h-full ${isMe ? 'bg-accent' : 'bg-primary'} w-2/3`} />
                                </div>
                              </div>
                            </div>
                          )}
                          <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Bar (Only visible in chat mode) */}
            {activeTab === 'chat' && (
              <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-2xl border border-red-200">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-xs pl-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <span>રેકોર્ડિંગ: {recordingTime}s (Recording...)</span>
                    </div>
                    <Button 
                      variant="danger" 
                      size="md" 
                      onClick={stopRecording}
                      className="px-4 py-1.5 text-xs"
                    >
                      Send Voice Note
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSendText} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="સંદેશ લખો (Type message)..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-primary focus:ring-2 focus:ring-accent outline-none"
                    />

                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-center hover:bg-amber-100 transition-colors shrink-0"
                      title="Record Voice Note"
                    >
                      <Mic className="w-5 h-5 text-accent-dark" />
                    </button>

                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4 text-accent" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
