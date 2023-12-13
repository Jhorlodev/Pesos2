import { useState } from 'react'

export function useLocalStorage (key, initialValue) {

  // Obtiene el valor del localStorage, o usa el valor inicial si no existe
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Función para actualizar el valor en el localStorage
  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  return [storedValue, setValue];
}

