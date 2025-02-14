import { configureStore } from '@reduxjs/toolkit';
import {apiCategory} from "../services/apiCategory.ts";


export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer, // Додаємо API reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware), // Додаємо API middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;