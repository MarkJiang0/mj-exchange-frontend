import { useMemo, useRef, useState } from "react"
import { RegisterFormEntity } from "./types"
import { register } from "@/services"

export function useRegisterForm(): {
  formData: RegisterFormEntity
  setPhone: (val: string | undefined) => void
  setCode: (val: string | undefined) => void
  setPassword: (val: string | undefined) => void
  setConfirmPass: (val: string | undefined) => void
  setAgree: () => void
  submitForm: () => void
} {
  const formDataRef = useRef<RegisterFormEntity>({agree: false})
  const [, forceUpdate] = useState<any>(null)

  const handleForm = useMemo(() => {
    const setPhone = (val: string | undefined) => {
      formDataRef.current.phone = val
      forceUpdate(val)
    }

    const setCode = (val: string | undefined) => {
      formDataRef.current.code = val
      forceUpdate(val)
    }

    const setPassword = (val: string | undefined) => {
      formDataRef.current.password = val
      forceUpdate(val)
    }

    const setConfirmPass = (val: string | undefined) => {
      formDataRef.current.confirmPass = val
      forceUpdate(val)
    }

    const setAgree = () => {
      if (formDataRef.current.agree) {
        formDataRef.current.agree = false
        forceUpdate(false)
      } else {
        formDataRef.current.agree = true
        forceUpdate(true)
      }
      
    }

    const submitForm = () => {
      register({
        phone: formDataRef.current.phone ?? '',
        code: formDataRef.current.code ?? '',
        password: formDataRef.current.password ?? ''
      }).then(resp => {
        console.log(resp)
      })
    }

    return {setPhone, setCode, setPassword, setConfirmPass, setAgree, submitForm}
  }, [])

  return {formData:formDataRef.current, ...handleForm}
}