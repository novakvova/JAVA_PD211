// Створюємо API Slice
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {APP_ENV} from "../env";
import {ICategoryItem, ICategoryPostRequest, ICategoryPutRequest} from "../pages/Category/types.ts";


export const apiCategory = createApi({
    reducerPath: 'Category', // Унікальний шлях для цього API у Redux Store
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api` }), // Базовий URL
    tagTypes: ["Category"], // Додаємо tag для категорій
    endpoints: (builder) => ({
        getCategories: builder.query<ICategoryItem[], void>({ // Запит для отримання категорій
            query: () => 'categories', // Шлях до endpoint
            providesTags: ["Category"], // Позначаємо, що цей запит пов'язаний з "Category"
        }),
        getCategory: builder.query<ICategoryItem, number>({
            query: (id) => `categories/${id}`,
            providesTags: (_, __, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation<ICategoryItem, ICategoryPostRequest>({
            query: (newCategory) => ({
                url: "categories",
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ["Category"], // Інвалідовуємо "Category" після створення
        }),
        updateCategory: builder.mutation<ICategoryItem, ICategoryPutRequest>({
            query: (updatedCategory) => ({
                url: `categories`,
                method: 'PUT',
                body: updatedCategory,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: 'Category', id }],
        }),
        deleteCategory: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `categories/${id}`,
                method: 'DELETE',
            }),
            // Інвалідовуємо весь список після видалення категорії
            invalidatesTags: ["Category"], // Вся категорія інвалідовується після видалення
        }),
    }),
});

// Автоматично згенерований хук
export const { useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,} = apiCategory;