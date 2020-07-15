export const getComputedTime = (seconds) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  const hours = date.getHours().toString().length === 1 ? `0${date.getHours().toString()}` : date.getHours();
  const minutes = date.getMinutes().toString().length === 1 ? `0${date.getMinutes().toString()}` : date.getMinutes();
  return `${hours}h${minutes}`;
}
