import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faClock, faCircle } from "@fortawesome/free-solid-svg-icons";
import {
  startQuiz,
  nextQuestion,
  setQuizData,
  setMode,
  setTimer,
  setCurrentQuestionIndex,
  setSelectedAnswer,
  closeTest,
  setQuizResults,
} from "../redux/actions";
import useFetchData from "../utils/useFetchData";
import "./Dashboard.css";

const Timer = ({ time }) => (
  <div className="timer">Time remaining: {time}s</div>
);

const Option = ({ option, selectedAnswer, onChange, questionId }) => (
  <div className="option">
    <input
      type="radio"
      id={`option-${option.id}`}
      name={`question-${questionId}`}
      value={option.id}
      checked={selectedAnswer === option.id}
      onChange={() => onChange(questionId, option.id)}
    />
    <label htmlFor={`option-${option.id}`}>{option.description}</label>
  </div>
);

const ResultItem = ({ question, selectedAnswer, index }) => {
  const selectedOption = question.options.find(
    (opt) => opt.id === selectedAnswer
  );
  const correctOption = question.options.find((opt) => opt.is_correct);
  const isCorrect = selectedOption && selectedOption.id === correctOption?.id;
  const textClass = selectedOption
    ? isCorrect
      ? "correct"
      : "wrong"
    : "unanswered";

  return (
    <div className="result-item">
      <p>
        <strong className={textClass}>Q{index + 1}:</strong>{" "}
        {question.description}
      </p>
      <p>
        <strong className={textClass}>Your Answer:</strong>{" "}
        {selectedOption ? selectedOption.description : "Not Answered"}
      </p>
      <p>
        <strong className={textClass}>Correct Answer:</strong>{" "}
        {correctOption ? correctOption.description : "Not Provided"}
      </p>
      <p>
        <strong>Explanation:</strong>{" "}
        {question.detailed_solution || "No detailed explanation available."}
      </p>
      <p className={`result-status ${textClass}`}>
        {selectedOption ? (isCorrect ? "Correct" : "Wrong") : "Not Answered"}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { data: quizData, isLoading, isError } = useFetchData("/api");

  const currentQuestionIndex = useSelector(
    (state) => state.quiz.currentQuestionIndex
  );
  const timer = useSelector((state) => state.quiz.timer);
  const quizMode = useSelector((state) => state.quiz.quizMode);
  const isQuizStarted = useSelector((state) => state.quiz.isQuizStarted);
  const selectedAnswers = useSelector((state) => state.quiz.selectedAnswers);
  const showResults = useSelector((state) => state.quiz.showResults);

  const timerInterval = useRef(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get("http://localhost:8000/quiz", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkLoginStatus();
  }, [navigate]);
  useEffect(() => {
    if (isQuizStarted && timer > 0) {
      timerInterval.current = setInterval(() => {
        dispatch(setTimer(timer - 1));
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isQuizStarted, timer, dispatch]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  const startQuizHandler = (mode) => {
    dispatch(setMode(mode));
    dispatch(startQuiz());
    setTimerBasedOnMode(mode);
  };

  const setTimerBasedOnMode = (mode) => {
    if (mode === "blitz") {
      dispatch(setTimer(60));
    }
    if (mode === "bullet") {
      dispatch(setTimer(30));
    }
    if (mode === "classical") {
      dispatch(setTimer(180));
    }
  };

  const handleOptionChange = (questionId, selectedOption) => {
    dispatch(setSelectedAnswer(questionId, selectedOption));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions?.length || 0) - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
      setTimerBasedOnMode(quizMode);
    }
  };

  const handleCloseTest = () => {
    clearInterval(timerInterval.current);
    dispatch(closeTest());
    dispatch(setTimer(0));
  };

  const handleSubmit = () => {
    const correctAnswersCount = Object.keys(selectedAnswers || {}).filter(
      (questionId) =>
        quizData.questions
          ?.find((q) => q.id === parseInt(questionId))
          ?.options.find(
            (opt) => opt.id === selectedAnswers[questionId] && opt.is_correct
          )
    ).length;

    dispatch(
      setQuizResults({
        correctAnswersCount,
        totalQuestions: quizData.questions?.length,
      })
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError}</div>;

  if (!quizData?.questions?.length) return <div>No quiz data available</div>;

  const correctAnswersCount = Object.keys(selectedAnswers || {}).filter(
    (questionId) =>
      quizData.questions
        .find((q) => q.id === parseInt(questionId))
        ?.options.find(
          (opt) => opt.id === selectedAnswers[questionId] && opt.is_correct
        )
  ).length;

  const totalQuestions = quizData.questions.length;
  const correctPercentage = (
    (correctAnswersCount / totalQuestions) *
    100
  ).toFixed(2);

  return (
    <div className="quiz-container">
      {!isQuizStarted ? (
        <div className="start-container">
          <h2>Select Format</h2>
          <div className="quiz-buttons-container">
            {[
              { mode: "blitz", icon: faBolt },
              { mode: "classical", icon: faClock },
              { mode: "bullet", icon: faCircle },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                className="quiz-btn"
                onClick={() => startQuizHandler(mode)}
              >
                <FontAwesomeIcon icon={icon} className="quiz-icon" />
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
              </button>
            ))}
          </div>
        </div>
      ) : showResults ? (
        <div className="quiz-results">
          <h2>Quiz Summary</h2>
          {quizData.questions.map((question, index) => (
            <ResultItem
              key={index}
              question={question}
              selectedAnswer={selectedAnswers[question.id]}
              index={index}
            />
          ))}
          <div className="quiz-summary">
            <p>
              <strong>{correctAnswersCount}</strong> out of{" "}
              <strong>{totalQuestions}</strong> questions were correct.
            </p>
            <p>
              <strong>{correctPercentage}%</strong> of questions answered
              correctly.
            </p>
          </div>
          <button className="close-test-btn" onClick={handleCloseTest}>
            Close Test
          </button>
        </div>
      ) : (
        <div className="quiz-questions">
          <div className="question-container">
            <p>{quizData?.questions?.[currentQuestionIndex]?.description}</p>
            {quizData?.questions?.[currentQuestionIndex]?.options.map(
              (option) => (
                <Option
                  key={option.id}
                  option={option}
                  selectedAnswer={
                    selectedAnswers[
                      quizData?.questions?.[currentQuestionIndex]?.id
                    ]
                  }
                  onChange={handleOptionChange}
                  questionId={quizData?.questions?.[currentQuestionIndex]?.id}
                />
              )
            )}
          </div>
          <Timer time={timer} />
          <div className="quiz-action-buttons">
            {currentQuestionIndex < quizData?.questions?.length - 1 ? (
              <button className="submit-btn" onClick={handleNextQuestion}>
                Next Question
              </button>
            ) : (
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            )}
            <button className="close-test-btn" onClick={handleCloseTest}>
              Close Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
