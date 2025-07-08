export const MessageType = {
    ERROR: 'error',
    SUCCESS: 'success',
    INFO: 'info',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];