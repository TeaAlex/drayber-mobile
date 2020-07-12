export const getComputedTime = (seconds) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return `${date.getHours()}h${date.getMinutes()}`;
}
