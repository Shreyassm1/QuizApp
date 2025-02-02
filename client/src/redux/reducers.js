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

const initialState = {
  quizData: {},
  currentQuestionIndex: 0,
  timer: 0,
  isQuizStarted: false,
  quizMode: "",
  selectedAnswers: {},
  showResults: false,
  quizResults: {},
};

const quizReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_QUIZ:
      return { ...state, isQuizStarted: true };
    // case SUBMIT_QUIZ:
    //   return {
    //     ...state,
    //     selectedAnswers: {
    //       ...state.selectedAnswers,
    //       [action.payload.questionId]: action.payload.selectedOption,
    //     },
    //   };
    case CLOSE_TEST:
      return {
        ...state,
        isQuizStarted: false,
        showResults: false,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        timer: 0,
      };
    case NEXT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        timer:
          state.quizMode === "blitz"
            ? 60
            : state.quizMode === "bullet"
            ? 30
            : 180,
      };
    case SET_TIMER:
      return { ...state, timer: action.payload };
    case SET_MODE:
      return { ...state, quizMode: action.payload };
    case SET_SELECTED_ANSWER:
      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          ...action.payload,
        },
      };

    case SET_CURRENT_QUESTION_INDEX:
      return { ...state, currentQuestionIndex: action.payload };
    case SET_QUIZ_DATA:
      return { ...state, quizData: action.payload };
    case SET_QUIZ_RESULTS:
      return { ...state, quizResults: action.payload, showResults: true };

    default:
      return state;
  }
};

export default quizReducer;
