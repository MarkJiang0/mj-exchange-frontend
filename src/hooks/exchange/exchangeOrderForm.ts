import { ExchangeOrder, ExchangeOrderDirection, ExchangeOrderType, addOrder } from "@/services";
import { useMemo, useRef, useState } from "react";

export function useExchangeOrderForm(): {
  formData: Partial<ExchangeOrder>
  setPrice: (val: number | undefined) => void, 
  setAmount: (val: number | undefined) => void, 
  initForm: (symbol: string, type: ExchangeOrderType, direction: ExchangeOrderDirection) => void,
  submitForm: () => void
} {
  const formDataRef = useRef<Partial<ExchangeOrder>>({})
  const [, forceUpdate] = useState<any>(null)

  const handleForm = useMemo(() => {
    const setPrice = (val: number | undefined) => {
      formDataRef.current.price = val
      forceUpdate(val)
    }

    const setAmount = (val: number | undefined) => {
      formDataRef.current.amount = val
      forceUpdate(val)
    }

    const initForm = (symbol: string, type: ExchangeOrderType, direction: ExchangeOrderDirection) => {
      formDataRef.current.symbol = symbol
      formDataRef.current.direction = direction
      formDataRef.current.type = type
    }

    const submitForm = () => {
      if (!formDataRef.current.symbol || !formDataRef.current.direction || !formDataRef.current.type) {
        return
      }
      if (!formDataRef.current.price ) {
        return
      }
      if (!formDataRef.current.amount ) {
        return
      }

      addOrder({
        symbol: formDataRef.current.symbol ?? '',
        type: formDataRef.current.type ?? '',
        direction: formDataRef.current.direction ?? '',
        price: formDataRef.current.price ?? 0,
        amount: formDataRef.current.amount ?? 0,
      }).then(resp => {
        console.log(resp)
      })
    }

    return {setPrice, setAmount, initForm, submitForm}
  }, [])

  return {formData:formDataRef.current, ...handleForm}
}