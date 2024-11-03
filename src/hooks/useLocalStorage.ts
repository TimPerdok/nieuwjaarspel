import { useEffect, useState } from "react";

export enum LocalStorageKeys {
  SETUP = "SETUP",
  SETTINGS = "SETTINGS",
  LEADERBOARD = "LEADERBOARD",
  LAST_WINNER = "LAST_WINNER",
}

export type LocalStorage = {
  [LocalStorageKeys.SETUP]: object,
}

type Any = string | number | boolean | object | Any[]

type setValue<T> = (v: T) => void

export default function useLocalStorage<T extends object | null | Any[]>(lsKey: LocalStorageKeys, initialValue: T) {
  const [value, setValue]: [v: T, setValue: setValue<T> ] = useState<T>(localStorage.getItem(lsKey)
  ? JSON.parse(localStorage.getItem(lsKey) as string)
  : initialValue);

  // Sync state with local storage
  useEffect(() => {
    const oldSetItem = localStorage.setItem;
    localStorage.setItem = function() {
      const result = oldSetItem.apply(this, arguments as any);
      // Hook into the setItem method to update the state
      try {
        const [key, value] = arguments;
        if (lsKey !== key) return result;
        setValue(JSON.parse(value));
      } catch (error) {
        console.error(error);
      }
    }
  }, [lsKey, initialValue]);

  // Sync local storage with state
  const setState: setValue<T> = (newValue: T) => localStorage.setItem(lsKey, JSON.stringify(newValue));

  return [value, setState] as const;
}