import {useState} from "react";

export function useDecrement(value = 0, step = 1) {
  const [count, setCount] = useState(value);
  const decrement = () => {
    setCount(c => c - step);
  }
  return [count, decrement];
}


