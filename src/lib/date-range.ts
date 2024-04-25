import { Account } from './accounts';

export interface StartAndEndDate {
  start: Date;
  end: Date;
}

export function getStartAndEndOfMonth(date: Date, monthBarrier: Account["monthBarrier"], day: number, offset: number): StartAndEndDate {
  if (monthBarrier === 'last') {
    return getBasedOnLastPayDay(date, day, offset);
  } 

  if (monthBarrier === 'calendar') {
    return getBasedOnCalendar(date, day, offset);
  }

  throw new Error("Unrecognised email");
}

function getBasedOnLastPayDay(date: Date, dayOfWeek: number, offset: number): StartAndEndDate {
  let firstDayNextMonth = lastDayOfMonth(dayOfWeek, date.getFullYear(), date.getMonth());
  if (firstDayNextMonth <= date) {
    // To account for days in the month that are after the last Wednesday
    date.setMonth(date.getMonth() + 1);
    firstDayNextMonth = lastDayOfMonth(dayOfWeek, date.getFullYear(), date.getMonth());
  }
  const lastDayThisMonth = new Date(firstDayNextMonth)
  lastDayThisMonth.setDate(firstDayNextMonth.getDate() - 1);

  date.setMonth(date.getMonth() - 1);
  const lastDayPreviousMonth = lastDayOfMonth(dayOfWeek, date.getFullYear(), date.getMonth());

  if (offset === 0) {
    return {
      start: lastDayPreviousMonth,
      end: lastDayThisMonth
    }
  }

  return offset < 0 
    ? getBasedOnLastPayDay(new Date(lastDayPreviousMonth.getFullYear(), lastDayPreviousMonth.getMonth(), lastDayPreviousMonth.getDate() - 1), dayOfWeek, offset + 1) 
    : getBasedOnLastPayDay(new Date(lastDayThisMonth.getFullYear(), lastDayThisMonth.getMonth(), lastDayThisMonth.getDate() + 1), dayOfWeek, offset - 1);
}

function getBasedOnCalendar(month: Date, day: number, offset: number): StartAndEndDate {
  const offBy1 = month.getDate() < day ? -1 : 0;

  return {
    start: new Date(month.getFullYear(), month.getMonth() + offBy1 + offset, day),
    end: new Date(month.getFullYear(), month.getMonth() + offBy1 + 1 + offset, day - 1)
  }
}

function lastDayOfMonth(dayIndex: number, year: number, month: number) {
  var lastDay = new Date(year, month + 1, 0);
  if (lastDay.getDay() < dayIndex) {
    lastDay.setDate(lastDay.getDate() - 7);
  }
  lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - dayIndex));
  return lastDay;
}