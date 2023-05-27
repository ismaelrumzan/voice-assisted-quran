import { Inter } from 'next/font/google';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import microPhoneIcon from '../public/assets/icons8-microphone-100.png';
import styles from '../styles/speak.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Speak() {
  const commands = [
    {
      command: 'open *',
      callback: (website) => {
        window.open('http://' + website.split(' ').join(''));
      },
    },
    {
      command: 'change background colour to *',
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: 'reset',
      callback: () => {
        handleReset();
      },
    },
    ,
    {
      command: 'reset background colour',
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className={styles.microphone_container}>
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListening = () => {
    setIsListening(true);
    microphoneRef.current.classList.add('listening');
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove('listening');
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className={styles.microphone_container}>
        <div
          className={styles.microphone_icon_container}
          ref={microphoneRef}
          onClick={handleListening}
        >
          <Image
            src={microPhoneIcon}
            className={styles.microphone_icon}
            alt='microphone'
          />
        </div>
        <div className={styles.microphone_status}>
          {isListening ? 'Listening.........' : 'Click to start Listening'}
        </div>
        {isListening && (
          <button className={styles.btn} onClick={stopHandle}>
            Stop
          </button>
        )}
      </div>
      {transcript && (
        <div className={styles.microphone_result_container}>
          <div className={styles.microphone_result_text}>{transcript}</div>
          <button
            className={clsx(styles.microphone_reset, styles.btn)}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
