import React, { useState, useEffect } from 'react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import { Mic } from 'lucide-react';
import mockData from '../../data/mockCard.json'; // Import the mock data
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
export default function Help() {
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

    const handleOptionClick = async (option: string) => {
        if (option.startsWith('Gate')) {
            try {
                const response = await fetch(
                    'https://ed5zq5eya8.execute-api.ap-southeast-1.amazonaws.com/prod//directions/checkin/' +
                        option,
                );
                const data: GateInfo = await response.json();
                setGateInfo(data);
                setShowGateInfo(true);
            } catch (error) {
                console.error('Error fetching gate info:', error);
            }
        }
        // Logic for other options can go here.
    };

    return (
        <div className={styles.container}>
            <div className={styles.dialogBox}>
                {!showGateInfo ? (
                    <>
                        <div className={styles.helpBox}>
                            Hi, need help finding anything?
                        </div>
                        <div className={styles.helpoptions}>
                            {actions.map((action) => (
                                <button
                                    key={action.action_target}
                                    onClick={() =>
                                        handleOptionClick(action.action_target)
                                    }
                                >
                                    {action.action_target.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Speak or type your question here for Mei to assist you"
                            />
                            <div className={styles.micIcon}>
                                <Mic size={24} color="#A645A6" />
                            </div>
                        </div>
                    </>
                ) : (
                    gateInfo && (
                        <div className={styles.gateInfo}>
                            <div className={styles.mapHeaderBox}>
                                To reach {formatGateName(gateInfo.to)}, just
                                follow these steps:
                            </div>
                            <div className={styles.mapImage}>
                                {/* Placeholder for the map image */}
                            </div>
                            <div className={styles.steps}>
                                {gateInfo.direction_steps.map((step, index) => (
                                    <div key={index} className={styles.step}>
                                        <span>{step.step}</span>
                                        <span>{step.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
