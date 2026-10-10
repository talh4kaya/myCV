import { createContext, useContext } from 'react';

export type ChatMessage = {
    role: 'bot' | 'user';
    content: string;
};

type ChatbotContextValue = {
    messages: ChatMessage[];
    isTyping: boolean;
    sendMessage: (text: string) => Promise<void>;
    isFullscreenOpen: boolean;
    openFullscreen: () => void;
    closeFullscreen: () => void;
};

export const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined);

export const useChatbot = () => {
    const ctx = useContext(ChatbotContext);
    if (!ctx) throw new Error('useChatbot must be used within ChatbotProvider');
    return ctx;
};
