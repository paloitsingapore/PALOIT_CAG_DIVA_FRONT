export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://ed5zq5eya8.execute-api.ap-southeast-1.amazonaws.com/prod';

export const API_ENDPOINTS = {
    RECOGNIZE: `${API_BASE_URL}/recognize`,
    DIRECTIONS: `${API_BASE_URL}/directions/checkin`,
};

export const SOUL_MACHINE_API_KEY = {
    en: 'eyJzb3VsSWQiOiJkZG5hLXJlZmxhdW50LXNpbmdhcG9yZWEwYjItLWNoYW5naWFzc2lzdGVkd2EiLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV8zYmYzY2QyYS1jZjY2LTQwNmQtOGRlNC0zNjZhZmU5MGQ3MGYifQ==',
    es: 'eyJzb3VsSWQiOiJkZG5hLXJlZmxhdW50LXNpbmdhcG9yZWEwYjItLXNwYW5pc2hjaGFuZ2lraW8iLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV9lMTk0OWFmMC03ZDMzLTRjNDItODgyYi0yMDhlYjA5NGFhNmUifQ==',
};
