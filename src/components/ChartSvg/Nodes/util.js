import { moment } from "../../constants";

function helpDate(date) {
  if(typeof date === 'string'){
    date = date.replace(/,/ , "")
    date = date.replace(/: / ,":")
  }
  return date;
}

const timeWidthCache = {}

export const calcTimeDelta = (startTime, initialTime)=> {
  
  const name = startTime + ' - ' +initialTime
  if(timeWidthCache[name] != undefined) {
    return timeWidthCache[name]
  }
  const result =  dateToMilliseconds(startTime) - dateToMilliseconds(initialTime)
  timeWidthCache[name] = result
  return result;
}



export const dateToMilliseconds = date => {
  date = helpDate(date);
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

export function partialLeft(fn, ...leftArgs) {
  return function call(...args) {
    return fn.apply(null, leftArgs.concat(args));
  };
}