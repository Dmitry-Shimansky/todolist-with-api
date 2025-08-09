import type { RootState } from "@/app/store"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"

export const selectTodolists = (state: RootState): DomainTodolist[] => state.todolists
