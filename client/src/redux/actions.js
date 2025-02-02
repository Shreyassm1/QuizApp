import {
  START_QUIZ,
  // SUBMIT_QUIZ,
  CLOSE_TEST,
  NEXT_QUESTION,
  SET_TIMER,
  SET_MODE,
  SET_SELECTED_ANSWER,
  SET_CURRENT_QUESTION_INDEX,
  SET_QUIZ_DATA,
  SET_QUIZ_RESULTS,
} from "../utils/constants";

export const startQuiz = () => {
  return { type: START_QUIZ };
};

// export const submitQuiz = (selectedAnswers) => {
//   return { type: SUBMIT_QUIZ, payload: selectedAnswers };
// };

export const closeTest = () => {
  return { type: CLOSE_TEST };
};

export const nextQuestion = () => {
  return { type: NEXT_QUESTION };
};

export const setTimer = (timer) => {
  return { type: SET_TIMER, payload: timer };
};

export const setMode = (mode) => {
  return { type: SET_MODE, payload: mode };
};

export const setSelectedAnswer = (questionId, selectedOption) => ({
  type: SET_SELECTED_ANSWER,
  payload: { [questionId]: selectedOption },
});

export const setCurrentQuestionIndex = (index) => {
  return { type: SET_CURRENT_QUESTION_INDEX, payload: index };
};

export const setQuizData = (data) => {
  return { type: SET_QUIZ_DATA, payload: data };
};

export const setQuizResults = (results) => {
  return { type: SET_QUIZ_RESULTS, payload: results };
};
