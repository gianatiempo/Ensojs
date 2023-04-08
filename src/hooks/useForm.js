import { useCallback, useMemo, useReducer } from 'react'
import isEqual from 'react-fast-compare'

const Kind = {
  init: 'init',
  reset: 'reset',
  setValue: 'setValue',
  setValues: 'setValues',
  deleteField: 'deleteField',
  deleteFields: 'deleteFields',
}

function reducer(state, action) {
  switch (action.type) {
    case Kind.init:
      return {
        initialValues: { ...action.initialValues },
        currentValues: action.currentValues != null ? { ...action.currentValues } : { ...action.initialValues },
      }
    case Kind.reset:
      return {
        initialValues: state.initialValues,
        currentValues: state.initialValues,
      }
    case Kind.setValue:
      return {
        ...state,
        currentValues: {
          ...state.currentValues,
          [action.field]: action.value,
        },
      }
    case Kind.setValues: {
      const values = typeof action.values === 'function' ? action.values(state.currentValues) : action.values
      return {
        ...state,
        currentValues: {
          ...state.currentValues,
          ...values,
        },
      }
    }
    case Kind.deleteField: {
      const newValues = { ...state.currentValues }
      delete newValues[action.field]
      return {
        ...state,
        currentValues: newValues,
      }
    }
    case Kind.deleteFields: {
      const newValues = { ...state.currentValues }
      for (const field of action.fields) {
        delete newValues[field]
      }
      return {
        ...state,
        currentValues: newValues,
      }
    }
    default:
      return state
  }
}

export default function useForm(initialValues, currentValues) {
  const [state, dispatch] = useReducer(reducer, {
    initialValues: { ...initialValues },
    currentValues: currentValues != null ? { ...currentValues } : { ...initialValues },
  })

  const setValue = useCallback((field, value) => {
    dispatch({ type: Kind.setValue, field, value })
  }, [])

  const setValues = useCallback(values => {
    dispatch({ type: Kind.setValues, values })
  }, [])

  const deleteField = useCallback(field => {
    dispatch({ type: Kind.deleteField, field })
  }, [])

  const deleteFields = useCallback(fields => {
    dispatch({ type: Kind.deleteFields, fields })
  }, [])

  const setInitialValues = useCallback((initialValues, currentValues) => {
    dispatch({ type: Kind.init, initialValues, currentValues })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: Kind.reset })
  }, [])

  const { initialValues: iValues, currentValues: cValues } = state

  const isClean = useMemo(() => {
    return isEqual(iValues, cValues)
  }, [iValues, cValues])

  return {
    initialValues: iValues,
    currentValues: cValues,
    setInitialValues,
    setValue,
    setValues,
    deleteField,
    reset,
    deleteFields,
    isClean,
    isDirty: !isClean,
  }
}
