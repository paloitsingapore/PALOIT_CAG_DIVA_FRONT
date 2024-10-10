'use client';

import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import { Wifi, Smartphone } from 'lucide-react';

export default function Home() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: '#6A1B9A',
            }}
        >
            <DigitalPersona />
            <div className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="w-full sm:w-1/2 max-w-md bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="bg-fuchsia-700 p-4 flex items-center justify-center">
                        <Wifi className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-4 bg-fuchsia-200 flex-grow">
                        <p className="text-black-900 font-medium">
                            Tap your phone below to connect to our free Wi-Fi
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 max-w-md bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="bg-fuchsia-700 p-4 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-4 bg-fuchsia-200 flex-grow">
                        <p className="text-black-900 font-medium">
                            Tap your phone below to continue receiving
                            assistance from Mei
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
