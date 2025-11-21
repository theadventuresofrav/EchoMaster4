
import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

interface UseNarratorReturn {
    isPlaying: boolean;
    isLoading: boolean;
    play: (text: string) => Promise<void>;
    stop: () => void;
    error: string | null;
}

export const useNarrator = (): UseNarratorReturn => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stop();
            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
            }
        };
    }, []);

    const stop = useCallback(() => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
            } catch (e) {
                // Ignore errors if already stopped
            }
            sourceNodeRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(async (text: string) => {
        // If already playing, stop first
        stop();
        setError(null);
        setIsLoading(true);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API Key not found");
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Call Gemini TTS
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional, deep voice
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            
            if (!base64Audio) {
                throw new Error("No audio data generated");
            }

            // Initialize Audio Context if needed
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }

            // Decode Base64
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Decode raw PCM data
            // The API returns raw PCM. We need to convert it to an AudioBuffer.
            // The default sample rate for Gemini TTS is 24000Hz.
            const dataInt16 = new Int16Array(bytes.buffer);
            const audioBuffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
            const channelData = audioBuffer.getChannelData(0);
            
            for (let i = 0; i < dataInt16.length; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }

            // Create Source
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                setIsPlaying(false);
                sourceNodeRef.current = null;
            };

            sourceNodeRef.current = source;
            source.start();
            setIsPlaying(true);

        } catch (err: any) {
            console.error("Narration Error:", err);
            setError(err.message || "Failed to play narration");
        } finally {
            setIsLoading(false);
        }
    }, [stop]);

    return { isPlaying, isLoading, play, stop, error };
};
