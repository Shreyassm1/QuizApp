import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};
const persistedCartReducer = persistReducer(persistConfig, quizReducer);

const store = configureStore({
  reducer: {
    quiz: persistedCartReducer,
  },
});

export const persistor = persistStore(store);
export default store;
