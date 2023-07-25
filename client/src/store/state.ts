import { compose, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import loadingSlice from "./slices/loading";
import { combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import thunk from "redux-thunk";  

// ...

const rootReducer = combineReducers({
  auth: authReducer,
  Loading: loadingSlice,
});
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer) //as typeof rootReducer;
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = configureStore({
  reducer: persistedReducer,
  middleware : [thunk],
  enhancers:composeEnhancers
});

export const persistor = persistStore(store)


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
