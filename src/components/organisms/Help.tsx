import React, { ReactNode } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import Transcript, { TranscriptEntry } from '../molecules/Transcript';

type HelpProps = {
    children?: ReactNode;
    transcript?: TranscriptEntry[];
    onSendMessage: (message: string) => void;
};

export default function Help({
    children,
    transcript,
    onSendMessage,
}: HelpProps) {
    return (
        <div className={styles.container}>
            {children && <div className={styles.videoWrapper}>{children}</div>}
            <div className={styles.dialogBox}>
                <Transcript
                    transcript={transcript ?? []}
                    onSendMessage={onSendMessage}
                />
            </div>
        </div>
    );
}
