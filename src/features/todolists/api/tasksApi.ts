import { instance } from "@/common/instance"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types.ts"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/api/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, string>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        method: "post",
        url: `/todo-lists/${todolistId}/tasks`,
        body: { title },
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        method: "put",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        body: model,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        method: "delete",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
      }),
      invalidatesTags: ["Task"],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi

export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask({ todolistId, title }: { todolistId: string; title: string }) {
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  // changeTaskStatus({ todolistId, taskId, model }: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
  //   return instance.put<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  // },
  updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    const { todolistId, taskId, model } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask({ todolistId, taskId }: { todolistId: string; taskId: string }) {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  // changeTaskTitle({ todolistId, taskId, model }: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
  //   return instance.put<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  // },
}
