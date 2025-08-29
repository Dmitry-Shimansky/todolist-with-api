import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/api/baseApi.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
      query: (body) => ({
        method: "post",
        url: "/auth/login",
        body,
      }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({
        method: "delete",
        url: "/auth/login",
      }),
    }),
    me: builder.query<BaseResponse<{ id: number; email: string; logi: string }>, void>({
      query: () => ({
        method: "get",
        url: "/auth/me",
      }),
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi
