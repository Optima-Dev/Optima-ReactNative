import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import Voice from '@react-native-voice/voice';

const VoiceAssistantContext = createContext({
  isListening: false,
  status: 'idle',
  error: '',
  partialText: '',
  finalText: '',
  startRecognition: () => {},
  stopRecognition: () => {},
  resetState: () => {},
});

export const VoiceAssistantProvider = ({ children }) => {
  const [state, setState] = useState({
    isListening: false,
    status: 'idle', // idle | listening | processing | error
    error: '',
    partialText: '',
    finalText: '',
  });
  const speechInProgress = useRef(false);
  const retryCount = useRef(0); // Track error 11 retries

  const resetState = useCallback((status = 'idle') => {
    setState({
      isListening: false,
      status,
      error: '',
      partialText: '',
      finalText: '',
    });
    retryCount.current = 0; // Reset retry count
  }, []);

  const onSpeechStart = useCallback(() => {
    console.log('[VoiceAssistant] Speech started');
    setState((prev) => ({
      ...prev,
      isListening: true,
      status: 'listening',
      error: '',
    }));
  }, []);

  const onSpeechEnd = useCallback(() => {
    console.log('[VoiceAssistant] Speech ended');
    setState((prev) => ({
      ...prev,
      isListening: false,
      status: prev.finalText ? 'processing' : 'idle',
    }));
  }, []);

  const onSpeechError = useCallback((e) => {
    const errorMessage = e?.error?.message || 'An error occurred';
    const errorCode = e?.error?.code;
    console.log('[VoiceAssistant] Speech error:', errorMessage, 'Code:', errorCode);

    if (errorCode === 11 || errorMessage.includes("Didn't understand")) {
      console.log('[VoiceAssistant] Error 11 detected, silently retrying', { retryCount: retryCount.current });
      if (retryCount.current < 2) { // Limit to 2 retries
        retryCount.current += 1;
        setTimeout(() => {
          if (!speechInProgress.current && !state.isListening) {
            startRecognition();
          }
        }, 500);
      } else {
        console.log('[VoiceAssistant] Max retries reached for error 11');
        resetState('idle');
      }
    } else {
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isListening: false,
        status: 'error',
      }));
    }
  }, [startRecognition, resetState]);

  const onSpeechPartialResults = useCallback((e) => {
    if (e?.value?.[0]) {
      console.log('[VoiceAssistant] Partial results:', e.value[0]);
      setState((prev) => ({ ...prev, partialText: e.value[0] }));
    }
  }, []);

  const onSpeechResults = useCallback((e) => {
    if (e?.value?.[0]) {
      console.log('[VoiceAssistant] Final results:', e.value[0]);
      setState((prev) => ({
        ...prev,
        finalText: e.value[0],
        isListening: false,
        status: 'processing',
      }));
    }
  }, []);

  useEffect(() => {
    console.log('[VoiceAssistant] Initializing Voice listeners');
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      console.log('[VoiceAssistant] Cleaning up Voice listeners');
      try {
        Voice.stop();
        Voice.destroy();
        Voice.removeAllListeners();
        resetState('idle');
        speechInProgress.current = false;
        retryCount.current = 0;
        console.log('[VoiceAssistant] Cleanup completed');
      } catch (err) {
        console.error('[VoiceAssistant] Error during cleanup:', err);
      }
    };
  }, [onSpeechStart, onSpeechEnd, onSpeechError, onSpeechResults, onSpeechPartialResults, resetState]);

  const startRecognition = useCallback(async () => {
    console.log('[VoiceAssistant] Starting recognition');
    resetState('listening');
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.log('[VoiceAssistant] Error starting recognition:', e?.message || e);
      setState((prev) => ({
        ...prev,
        error: e?.message || 'Error starting recognition',
        status: 'error',
        isListening: false,
      }));
      // Retry once after a brief delay
      if (retryCount.current < 2) {
        retryCount.current += 1;
        setTimeout(async () => {
          try {
            console.log('[VoiceAssistant] Retrying recognition', { retryCount: retryCount.current });
            await Voice.start('en-US');
          } catch (retryErr) {
            console.log('[VoiceAssistant] Retry failed:', retryErr?.message || retryErr);
            setState((prev) => ({
              ...prev,
              error: retryErr?.message || 'Error starting recognition after retry',
              status: 'error',
              isListening: false,
            }));
          }
        }, 500);
      } else {
        console.log('[VoiceAssistant] Max retries reached for startRecognition');
        resetState('idle');
      }
    }
  }, [resetState]);

  const stopRecognition = useCallback(async () => {
    try {
      console.log('[VoiceAssistant] Stopping recognition');
      await Voice.stop();
      resetState('idle');
    } catch (e) {
      console.error('[VoiceAssistant] Error stopping recognition:', e?.message || e);
    }
  }, [resetState]);

  return (
    <VoiceAssistantContext.Provider
      value={{
        ...state,
        startRecognition,
        stopRecognition,
        resetState,
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => useContext(VoiceAssistantContext);