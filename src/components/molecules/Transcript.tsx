import React, { useRef, useEffect, useState } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import { Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
                className={`overflow-y-scroll  w-full pl-4`}
                style={{ flexGrow: 1, height: '60vh' }}
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
                                    className={`w-full rounded-lg p-3 ${
                                        options && options.length > 0
                                            ? `${styles.welcomeMessage}`
                                            : `${styles.chatBubble}`
                                    }   ${
                                        source === 'user'
                                            ? ` ${styles.userMessage} bg-blue-500 text-white rounded-br-none`
                                            : ` ${styles.systemMessage} bg-gray-200 text-black rounded-bl-none`
                                    }
                                    `}
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
                                <div
                                    className="grid grid-cols-2"
                                    style={{ gap: '32px', marginTop: '32px' }}
                                >
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

            <div className={`${styles.inputContainer} pl-4`}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder={t('inputPlaceholder')}
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
