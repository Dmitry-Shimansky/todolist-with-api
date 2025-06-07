import type {RootState} from '@/app/store'
import type {Todolist} from './todolists-reducer.ts'

export const selectTodolists = (state: RootState): Todolist[] => state.todolists
