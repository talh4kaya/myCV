import { createContext, useContext } from 'react';

export type ThinkingStep = {
    text: string;
    // Modelin inceleyip elediği olasılık ("ruled out")
    ruledOut: boolean;
};

export type ChatMessage = {
    role: 'bot' | 'user';
    content: string;
    // Sadece Gemini'den gelen cevaplarda dolu
    thinking?: {
        steps: ThinkingStep[];
        startedAt: number;
        // Cevabın ilk parçası geldiği an dolar; o ana kadar "düşünüyor" gösterilir
        durationMs?: number;
    };
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
