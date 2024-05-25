import { User } from "@/services"
import { produce } from "immer"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

type UserState = {
  userInfo: User | undefined
  save: (user: User) => void
  delete: () => void
}



const createUserState = (set: any, get: any): UserState => ({
  userInfo: {},

  save: (user: User) => {
    set(
      produce((state: UserState) => {
        state.userInfo = user
      })
    )
  },
  delete: () => {
    set(
      produce((state: UserState) => {
        state.userInfo = undefined
      })
    )
  }

})

const options = {
  name: 'user',
  storage: createJSONStorage(() => localStorage)
}
const useUserStore = create(persist(createUserState, options))

export default useUserStore