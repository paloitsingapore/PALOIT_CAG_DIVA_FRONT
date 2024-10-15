import React, { useRef, useEffect, useState } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import { Mic } from 'lucide-react';
export interface TranscriptEntry {
    source: 'user' | 'persona';
    text: string;
    timestamp: string;
    key?: string;
    message?: any;
    attributes?: { [key: string]: any[] };
    options?: {
        name: string;
        action?: string;
    }[];
}

interface TranscriptProps {
    transcript: TranscriptEntry[];
    onSendMessage: (message: string) => void;
}

const Transcript: React.FC<TranscriptProps> = ({
    transcript,
    onSendMessage,
}) => {
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
            <div
                ref={scrollRef}
                /* max-h-[70vh] */
                className={`overflow-y-scroll  w-full space-y-4 p-4`}
                style={{ flexGrow: 1, height: '80vh' }}
            >
                {transcript.map(
                    (
                        {
                            source,
                            text,
                            timestamp,
                            key,
                            attributes,
                            options,
                            message,
                        },
                        index,
                    ) => (
                        <div key={key ?? timestamp} className="flex flex-col">
                            <div
                                className={`flex ${source === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        source === 'user'
                                            ? `${styles.chatBubble} ${styles.userMessage} bg-blue-500 text-white rounded-br-none`
                                            : `${styles.chatBubble} ${styles.systemMessage} bg-gray-200 text-black rounded-bl-none`
                                    }`}
                                    style={
                                        options && options.length > 0
                                            ? {
                                                  fontSize: '96px',
                                                  fontWeight: '400',
                                                  fontFamily: 'Hind',
                                                  lineHeight: '124.8px',
                                                  maxWidth: 'max-content',
                                                  marginRight: '30px',
                                                  /* width: auto; */
                                                  // width: Fixed(1, 258px) px;
                                                  // height: Fixed(357px) px;
                                                  top: '296px',
                                                  left: '1394px',
                                                  padding:
                                                      '40px 56px 40px 56px',
                                                  gap: '8px',
                                                  borderRadius:
                                                      '64px 64px 64px 8px',
                                              }
                                            : {}
                                    }
                                >
                                    <div>{text}</div>
                                </div>
                            </div>
                            {attributes &&
                                attributes['image'] &&
                                attributes['image'].map((image, index) => (
                                    <img
                                        key={index}
                                        className={styles.chatBubbleImage}
                                        src={image}
                                        alt="Persona"
                                        style={{
                                            paddingTop: '10px',
                                            width: '553px',
                                            borderRadius: '24px',
                                        }}
                                    />
                                ))}
                            {options && options.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {options.map((option, optionIndex) => (
                                        <button
                                            key={optionIndex}
                                            className="p-2 text-center rounded-lg bg-fuchsia-100 text-purple-950"
                                            style={{
                                                width: '604px',
                                                height: '204px',
                                                top: '709px',
                                                left: '1394px',
                                                padding: '40px 56px',
                                                gap: '8px',
                                                borderRadius: '48px',
                                                fontFamily: 'Hind',
                                                fontSize: '56px',
                                                lineHeight: '67.2px',
                                                color: 'background: #2E0055',
                                            }}
                                            onClick={() =>
                                                onSendMessage(
                                                    option.action ||
                                                        option.name,
                                                )
                                            }
                                        >
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ),
                )}
            </div>

            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Speak or type your question here for Mei to assist you"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    style={{
                        fontFamily: 'Hind',
                        fontSize: '40px',
                        fontWeight: 400,
                        lineHeight: '52px',
                        textAlign: 'left',
                    }}
                />
                <div className={styles.micIcon}>
                    <Mic size={35} color="#A645A6" />
                </div>
            </div>
        </>
    );
};

export default Transcript;
