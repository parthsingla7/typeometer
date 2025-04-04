import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(60);
  const [wordsSubmitted, setWordsSubmitted] = useState(0);
  const [wordsCorrect, setWordsCorrect] = useState(0);
  const [timer, setTimer] = useState(time);
  const [difficulty, setDifficulty] = useState('basic');
  const [active, setActive] = useState(false);
  const [testText, setTestText] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [testComplete, setTestComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRef = useRef(null);

  const topWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"];
  const basicWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"];

  const generateTest = () => {
    const words = difficulty === 'top' ? topWords : basicWords;
    const test = [];
    for (let i = 0; i < 200; i++) {
      test.push(words[Math.floor(Math.random() * words.length)]);
    }
    setTestText(test);
  };

  useEffect(() => {
    if (started) {
      generateTest();
      setTimer(time);
      setTestComplete(false);
      setWordsSubmitted(0);
      setWordsCorrect(0);
      setCurrentWordIndex(0);
      setInputValue('');
      setActive(false);
    }
  }, [started, time, difficulty]);

  useEffect(() => {
    let interval;
    if (active && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setActive(false);
      setTestComplete(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active, timer]);

  const handleInputChange = (e) => {
    if (!active && !testComplete) {
      setActive(true);
    }
    setInputValue(e.target.value);
  };

  const checkCurrentWord = () => {
    const wordToCompare = testText[currentWordIndex];
    const isCorrect = inputValue.trim() === wordToCompare;
    setWordsSubmitted(wordsSubmitted + 1);
    if (isCorrect) {
      setWordsCorrect(wordsCorrect + 1);
    }
    setCurrentWordIndex(currentWordIndex + 1);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' && inputValue.trim() !== '') {
      e.preventDefault();
      checkCurrentWord();
    }
  };

  if (!started) {
    return (
      <div className="start-screen">
        <h1>Welcome to Type-O-Meter</h1>
        <div className="options">
          <p>Select Time:</p>
          <button
            onClick={() => setTime(15)}
            className={time === 15 ? 'selected' : ''}>15s</button>
          <button
            onClick={() => setTime(30)}
            className={time === 30 ? 'selected' : ''}>30s</button>
          <button
            onClick={() => setTime(60)}
            className={time === 60 ? 'selected' : ''}>60s</button>
          <p>Select Difficulty:</p>
          <button
            onClick={() => setDifficulty('basic')}
            className={difficulty === 'basic' ? 'selected' : ''}>Basic</button>
          <button
            onClick={() => setDifficulty('top')}
            className={difficulty === 'top' ? 'selected' : ''}>Advanced</button>
        </div>
        <button className="start-button" onClick={() => setStarted(true)}>Start Test</button>
      </div>
    );
  }

  return (
    <div className="box">
      <h1>Type-O-Meter</h1>
      <div className="stats">
        <div>Time: {timer}s</div>
        <div>WPM: {Math.round((wordsCorrect / (time - timer)) * 60) || 0}</div>
        <div>Accuracy: {Math.round((wordsCorrect / wordsSubmitted) * 100) || 0}%</div>
      </div>
      <div className="text-display">
        {testText.slice(currentWordIndex, currentWordIndex + 30).map((word, index) => (
          <span key={index + currentWordIndex}>
            {word}{' '}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={testComplete ? "Test complete!" : "Type here..."}
        disabled={testComplete}
        autoFocus
      />
      <button className="restart-button" onClick={() => setStarted(false)}>Restart</button>
    </div>
  );
}

export default App;