import { Dispatch } from "@reduxjs/toolkit"
import { changeStatusAC, setAppErrorAC } from "@/app/model/app-slice.ts"
import { BaseResponse } from "@/common/types"

export const handleAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  const error = data.messages.length ? data.messages[0] : "Some error occurred"
  dispatch(setAppErrorAC({ error }))
  dispatch(changeStatusAC({ status: "failed" }))
}
