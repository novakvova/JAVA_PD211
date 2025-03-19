// Створюємо API Slice
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {APP_ENV} from "../env";
import {AuthResponse, IUserLoginRequest, IUserRegisterRequest, LoginGoogleRequest} from "../pages/auth/types.ts";
import {jwtParse} from "../utilities/jwtParse.ts";


export const authApi = createApi({
    reducerPath: 'authApi', // Унікальний шлях для цього API у Redux Store
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/auth` }), // Базовий URL
    tagTypes: ["AuthUser"], // Додаємо tag для категорій
    endpoints: (builder) => ({

        registerUser: builder.mutation<void, IUserRegisterRequest>({
            query: (userRegister) => ({
                url: "register",
                method: "POST",
                body: userRegister,
            }),
            //invalidatesTags: ["AuthUser"], // Інвалідовуємо "Category" після створення
        }),
        googleLoginUser: builder.mutation<AuthResponse, LoginGoogleRequest>({
            query: (userGoogle) => ({
                url: "google",
                method: "POST",
                body: userGoogle,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    //console.log("Login user", result);
                    if (result.data && result.data.token) {
                        const userInfo = jwtParse(result.data.token);
                        console.log("user info", userInfo);
                        // dispatch(setCredentials({ token: result.data.accessToken, refreshToken: result.data.refreshToken, remember: arg.remember }))
                        // dispatch(accountApiAuth.util.invalidateTags(["Favorites"]));
                        // dispatch(advertApi.util.invalidateTags(["Advert","Adverts","Locked","NotApproved","AdvertImages"]));
                        // dispatch(advertAuthApi.util.invalidateTags(["UserAdvert","UserAdverts"]));
                        // dispatch(adminMessageAuthApi.util.invalidateTags(["AdminMessages","Messeges","UnreadedMessages"]));
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
            //invalidatesTags: ["AuthUser"], // Інвалідовуємо "Category" після створення
        }),
        loginUser: builder.mutation<AuthResponse, IUserLoginRequest>({
            query: (userGoogle) => ({
                url: "login",
                method: "POST",
                body: userGoogle,
            }),
            //invalidatesTags: ["AuthUser"], // Інвалідовуємо "Category" після створення
        })
    }),
});

// Автоматично згенерований хук
export const {
    useRegisterUserMutation,
    useGoogleLoginUserMutation,
    useLoginUserMutation
} = authApi;