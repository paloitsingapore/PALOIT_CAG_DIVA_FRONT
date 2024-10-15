export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ijiv62tdzd.execute-api.ap-southeast-2.amazonaws.com/prod';

export const API_ENDPOINTS = {
    RECOGNIZE: `${API_BASE_URL}/recognize`,
    DIRECTIONS: `${API_BASE_URL}/directions/checkin`,
};
