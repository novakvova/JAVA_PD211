import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProduct } from "../pages/Product/types";
import { APP_ENV } from "../env";

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api` }),
    tagTypes: ["Product"], // Додаємо tag для категорій
    endpoints: (builder) => ({

        getAllProducts: builder.query<IProduct[], void>({
            query: () => 'products',
            providesTags: ["Product"]  // Позначаємо, що цей запит пов'язаний з "Product"
        }),

        getProductById: builder.query<IProduct, string>({
            query: (id) => `products/${id}`,
            providesTags: ["Product"]
        }),

    }),
});

export const {
    useGetAllProductsQuery,
    useGetProductByIdQuery,
} = productsApi;