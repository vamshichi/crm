import { useState, type ChangeEvent } from "react"

type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined
}

export function useForm<T extends Record<string, any>>(initialState: T, validationRules: ValidationRules<T>) {
  const [formData, setFormData] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value as T[keyof T] })) // ✅ Fix here

    if (validationRules[name as keyof T]) {
      const error = validationRules[name as keyof T]!(value as T[keyof T]) // ✅ Fix here
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key as keyof T]!(formData[key as keyof T])
      if (error) {
        newErrors[key as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  return { formData, handleChange, errors, validateForm, setFormData }
}
