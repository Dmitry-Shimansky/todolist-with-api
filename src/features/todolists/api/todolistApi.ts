import {instance} from "@/common/instance";
import {Todolist} from "./todolistsApi.types.ts";
import {BaseResponse} from "@/common/types";

export const todolistApi = {
    getTodolist() {
        return instance.get<Todolist[]>('/todo-lists')
    },
    changeTodolistTitle({id, title}: {id:string, title:string}) {
        return instance.put<BaseResponse>(`/todo-lists/${id}`, {title})
    },
    createTodolist(title: string) {
        return instance.post<BaseResponse<{ item: Todolist }>>('/todo-lists', {title})
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponse>(`/todo-lists/${id}`)
    }
}