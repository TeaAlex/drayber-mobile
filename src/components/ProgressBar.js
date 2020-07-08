import React, {useEffect} from 'react';
import {useDecrement} from "../hooks/useDecrement";
import {View} from 'react-native';
import tailwind from "tailwind-rn";

const ProgressBar = () => {

  const [count, decrement] = useDecrement(100, 10);
  let timer = null;

  useEffect(() => {
    timer = setInterval(() => {
      decrement();
    }, 1000)

    return function () {
      clearInterval(timer)
    }
  }, [count])

  return <View style={{...tailwind('bg-green-500 h-2'), width: `${count}%`}}/>
}

export default ProgressBar
