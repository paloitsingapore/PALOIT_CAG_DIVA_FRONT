import React, { useRef, useEffect } from 'react';

export interface TranscriptEntry {
  source: 'user' | 'persona';
  text: string;
  timestamp: string;
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
    <div ref={scrollRef} className="overflow-y-auto max-h-[40vh] md:max-h-full w-full space-y-4 p-4">
      {transcript.map(({ source, text, timestamp }, index) => (
        <div key={timestamp} className={`flex ${source === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] rounded-lg p-3 ${
            source === 'user' 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-200 text-black rounded-bl-none'
          }`}>
            <div className="text-xs mb-1">{source === 'user' ? 'You' : 'Digital Person'}</div>
            <div>{text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Transcript;