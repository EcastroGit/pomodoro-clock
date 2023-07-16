import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState("Session");

  const audioElement = useRef(null);

  useEffect(() => {
    if (timeLeft === 0) {
      audioElement.current.play();
      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else if (timerLabel === "Break") {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerRunning(false);
    setTimerLabel("Session");
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStartStop = () => {
    if (sessionLength > 0) {
      setTimerRunning((prevRunning) => !prevRunning);
    }
  };

  const handlePause = () => {
    setTimerRunning(false);
  };

  useEffect(() => {
    let countdownInterval;

    if (timerRunning) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            if (sessionLength === 1 && timerLabel === "Session") {
              setTimerRunning(false);
              audioElement.current.play();
              return 0;
            } else if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else if (timerLabel === "Break") {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownInterval);
    }

    return () => clearInterval(countdownInterval);
  }, [timerRunning, breakLength, sessionLength, timerLabel]);

  return (
    <div id="App">
      <div id="app-title">
        <p id="credits">Developed by <strong>Esteban Castro</strong></p>
        <h1>Pomodoro Clock</h1>
      </div>

      <div id="controls">
        <div className="length-control">
          <div id="break-label" className="label">
            Break Length
          </div>
          <span className="icons">
            <i
              id="break-decrement"
              className="bi bi-dash-circle"
              onClick={() =>
                setBreakLength((prevLength) => Math.max(prevLength - 1, 1))
              }
            ></i>
          </span>
          <div id="break-length" className="controls-screen">
            {breakLength}
          </div>
          <span className="icons">
            <i
              id="break-increment"
              className="bi bi-plus-circle"
              onClick={() =>
                setBreakLength((prevLength) => Math.min(prevLength + 1, 60))
              }
            ></i>
          </span>
        </div>

        <div className="length-control">
          <div id="session-label" className="label">
            Session Length
          </div>
          <span className="icons">
            <i
              id="session-decrement"
              className="bi bi-dash-circle"
              onClick={() =>
                setSessionLength((prevLength) => Math.max(prevLength - 1, 1))
              }
            ></i>
          </span>
          <div id="session-length" className="controls-screen">
            {sessionLength}
          </div>
          <span className="icons">
            <i
              id="session-increment"
              className="bi bi-plus-circle"
              onClick={() =>
                setSessionLength((prevLength) => Math.min(prevLength + 1, 60))
              }
            ></i>
          </span>
        </div>
      </div>

      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <div id="buttons-container">
        <span className="buttons">
          <i
            id="start_stop"
            className={`bi bi-play-circle${
              timerRunning ? " disabled" : ""
            }`}
            onClick={handleStartStop}
          ></i>
        </span>
        <span className="buttons">
          <i
            id="pause"
            className={`bi bi-pause-circle${
              !timerRunning ? " disabled" : ""
            }`}
            onClick={handlePause}
          ></i>
        </span>
        <span className="buttons">
          <i id="reset" className="bi bi-arrow-clockwise" onClick={handleReset}></i>
        </span>
      </div>

      <audio
        id="beep"
        ref={audioElement}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

export default App;
