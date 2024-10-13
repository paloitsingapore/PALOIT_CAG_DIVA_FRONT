import React, { useRef, useEffect, useState } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import { Mic } from 'lucide-react';

export interface TranscriptEntry {
  source: 'user' | 'persona';
  text: string;
  timestamp: string;
  key?: string;
}

interface TranscriptProps {
  transcript: TranscriptEntry[];
  onSendMessage: (message: string) => void;
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <>
      <div ref={scrollRef} className={`overflow-y-scroll max-h-[70vh] w-full space-y-4 p-4`}>
        {transcript.map(({ source, text, timestamp, key }, index) => (
          <div key={key ?? timestamp} className={`flex ${source === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${source === 'user'
              ? `${styles.chatBubble} ${styles.userMessage} bg-blue-500 text-white rounded-br-none`
              : `${styles.chatBubble} ${styles.systemMessage} bg-gray-200 text-black rounded-bl-none`
              }`}>
              <div>{text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          placeholder="Speak or type your question here for Mei to assist you"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.micIcon}>
          <Mic size={24} color="#A645A6" />
        </div>
      </div>
    </>
  );
};

export default Transcript;