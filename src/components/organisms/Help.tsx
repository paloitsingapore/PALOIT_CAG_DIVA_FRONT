import React, { useState, useEffect, ReactNode } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import mockData from '../../data/mockCard.json'; // Import the mock data
import Transcript, { TranscriptEntry } from '../molecules/Transcript';
import { API_ENDPOINTS } from '@AssistedWayinding/config/apiConfig';
interface Action {
    action_type: string;
    action_target: string;
}
interface DirectionStep {
    step: string;
    duration: string;
}
interface GateInfo {
    from: string;
    to: string;
    map_image: string;
    direction_steps: DirectionStep[];
}

const formatGateName = (gateName: string) => {
    return gateName
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

interface HelpProps {
    children?: ReactNode;
    transcript?: TranscriptEntry[];
    onSendMessage: (message: string) => void;
}

export default function Help({ children, transcript, onSendMessage }: HelpProps) {
    const [actions, setActions] = useState<Action[]>([]);
    const [showGateInfo, setShowGateInfo] = useState(false);
    const [gateInfo, setGateInfo] = useState<GateInfo | null>(null);

    useEffect(() => {
        // Fetch data from the API
        const fetchActions = async () => {
            try {
                const response = await fetch('YOUR_API_ENDPOINT');
                const data = await response.json();
                if (data && data.length > 0) {
                    setActions(data);
                } else {
                    setActions(mockData); // Use mock data if API returns no data
                }
            } catch (error) {
                console.error('Error fetching actions:', error);
                setActions(mockData);
                console.log(mockData);
            }
        };

        fetchActions();
    }, []);

    return (
        <div className={styles.container}>
            {children && <div className={styles.videoWrapper}>{children}</div>}
            <div className={styles.dialogBox}>
                <Transcript transcript={transcript ?? []} onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}
