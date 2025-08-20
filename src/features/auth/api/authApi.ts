import { instance } from "@/common/instance"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { BaseResponse } from "@/common/types"

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(`/auth/login`, payload)
  },
  logout() {
    return instance.delete<BaseResponse>(`/auth/login`)
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; logi: string }>>(`/auth/me`)
  },
}
