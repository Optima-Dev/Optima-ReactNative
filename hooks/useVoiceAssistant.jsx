import { useState, useEffect, useCallback } from 'react';
import Voice from '@react-native-voice/voice';

// A more robust hook for handling voice recognition with clear states.
export const useVoiceAssistant = () => {
  const [state, setState] = useState({
    isListening: false,
    status: 'idle', // 'idle', 'listening', 'processing', 'error'
    error: '',
    partialText: '',
    finalText: '',
  });

  const resetState = useCallback((status = 'idle') => {
    setState({ isListening: false, status, error: '', partialText: '', finalText: '' });
  }, []);

  const onSpeechStart = useCallback(() => {
    setState(prev => ({ ...prev, isListening: true, status: 'listening', error: '' }));
  }, []);

  const onSpeechEnd = useCallback(() => {
    // If a final text was set, we are processing, otherwise we go back to idle.
    setState(prev => ({ ...prev, isListening: false, status: prev.finalText ? 'processing' : 'idle' }));
  }, []);

  const onSpeechError = useCallback((e) => {
    setState(prev => ({ ...prev, error: e.error?.message || 'An error occurred', isListening: false, status: 'error' }));
  }, []);

  const onSpeechPartialResults = useCallback((e) => {
    if (e.value?.[0]) {
      setState(prev => ({ ...prev, partialText: e.value[0] }));
    }
  }, []);

  const onSpeechResults = useCallback((e) => {
    if (e.value?.[0]) {
      setState(prev => ({ ...prev, finalText: e.value[0], isListening: false, status: 'processing' }));
    }
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSpeechStart, onSpeechEnd, onSpeechError, onSpeechResults, onSpeechPartialResults]);

  const startRecognition = useCallback(async () => {
    resetState('listening');
    try {
      await Voice.start('en-US');
    } catch (e) {
      setState(prev => ({ ...prev, error: e.message, status: 'error' }));
    }
  }, [resetState]);

  const stopRecognition = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error("Error stopping voice recognition:", e);
    }
  }, []);

  return { ...state, startRecognition, stopRecognition, resetState };
};
