'use client';

import dynamic from 'next/dynamic';

const NoSSRHome = dynamic(
    () => import('@AssistedWayinding/components/organisms/Home'),
    {
        ssr: false,
    },
);

const Page: React.FC = () => {
    return <NoSSRHome />;
};

export default Page;
