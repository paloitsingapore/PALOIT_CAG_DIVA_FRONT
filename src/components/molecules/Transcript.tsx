import React, { useRef, useEffect } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';

export interface TranscriptEntry {
  source: 'user' | 'persona';
  text: string;
  timestamp: string;
  key?: string;
}

interface TranscriptProps {
  transcript: TranscriptEntry[];
}

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div ref={scrollRef} className={`overflow-y-scroll max-h-[40vh] md:max-h-full w-full space-y-4 p-4`}>
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
  );
};

export default Transcript;