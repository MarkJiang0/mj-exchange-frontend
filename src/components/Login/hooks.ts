import { useMemo, useRef, useState } from "react"
import { login, register } from "@/services"
import { LoginFormEntity } from "./types"
import { Bounce, toast } from "react-toastify"
import Router from "next/router"
import useUserStore from "@/stores/UserStore"

export function useLoginForm(): {
  formData: LoginFormEntity
  setPhone: (val: string | undefined) => void
  setPassword: (val: string | undefined) => void
  submitForm: () => void
} {
  const {save} = useUserStore()
  const formDataRef = useRef<LoginFormEntity>({})
  const [, forceUpdate] = useState<any>(null)

  const handleForm = useMemo(() => {
    const setPhone = (val: string | undefined) => {
      formDataRef.current.phone = val
      forceUpdate(val)
    }

    const setPassword = (val: string | undefined) => {
      formDataRef.current.password = val
      forceUpdate(val)
    }

    const submitForm = () => {
      login({
        username: formDataRef.current.phone ?? '',
        password: formDataRef.current.password ?? ''
      }).then(resp => {
        save(resp.data)
        window.localStorage.setItem('TOKEN', resp.data.token)
        toast('Login success!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        Router.push('/')
      })
    }

    return {setPhone, setPassword, submitForm}
  }, [])

  return {formData:formDataRef.current, ...handleForm}
}