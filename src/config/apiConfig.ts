export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const API_ENDPOINTS = {
    RECOGNIZE: `${API_BASE_URL}/recognize`,
    DIRECTIONS: `${API_BASE_URL}/directions/checkin`,
};

export const SOUL_MACHINE_API_KEY = {
    en: process.env.NEXT_PUBLIC_SOUL_MACHINE_API_KEY_EN,
    es: process.env.NEXT_PUBLIC_SOUL_MACHINE_API_KEY_ES,
    zh: process.env.NEXT_PUBLIC_SOUL_MACHINE_API_KEY_ZH,
};
