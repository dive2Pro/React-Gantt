import { moment } from "../../constants";

/**
 *
 */
export const getUsedPositions = (usedTime, initialTime) => {
  const { startTime, endTime } = usedTime;
  const startMilliseconds = dateToMilliseconds(startTime);
  const endMilliseconds = dateToMilliseconds(endTime);
  const deltaTime = startMilliseconds - initialTime;
  const timeStartPoint = deltaTime;
  const timeWidth = endMilliseconds - startMilliseconds;

  return {
    timeStartPoint,
    timeWidth
  };
};


export const dateToMilliseconds = date => {
  if(typeof date === 'string'){
    date = date.replace(/,/ , "")
    date = date.replace(/: / ,":")
  }
const result =  moment(date).valueOf();
  return result;
} 

export function callAll(...fns) {
  return function eventHandle(...args) {
    fns.filter(Boolean).forEach(fn => {
      fn.apply(this, args);
    });
  };
}

export function partialRight(fn, ...rightArgs) {
  return function call(...args) {
    return fn.apply(null, args.concat(rightArgs));
  };
}
