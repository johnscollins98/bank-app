export interface StartAndEndDate {
  start: Date;
  end: Date;
}

export function getStartAndEndOfMonth(email: string, month: Date): StartAndEndDate {
  if (email === process.env.EMAIL) {
    return getBasedOnLastPayDay(month, 4);
  } 

  if (email === process.env.EMAIL_2) {
    return getBasedOnCalendar(month);
  }

  throw new Error("Unrecognised email");
}

function getBasedOnLastPayDay(date: Date, dayOfWeek: number): StartAndEndDate {
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

  return {
    start: lastDayPreviousMonth,
    end: lastDayThisMonth
  }
}

function getBasedOnCalendar(month: Date): StartAndEndDate {
  return {
    start: new Date(month.getFullYear(), month.getMonth(), 1),
    end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
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