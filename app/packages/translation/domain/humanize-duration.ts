import type { TranslateFunctionType } from "~/packages/translation";

export const humanizeDuration = (durationInSeconds: number, t: TranslateFunctionType) => {
  const secondsInAMinute = 60;
  const minsInAnHour = 60;
  const hoursInADay = 24;
  const daysInAWeek = 7;
  const daysInAYear = 365;

  const secondsInAnHour = minsInAnHour * secondsInAMinute;
  const secondsInADay = hoursInADay * secondsInAnHour;
  const secondsInAWeek = daysInAWeek * secondsInADay;
  const secondsInAYear = daysInAYear * secondsInADay;

  const label = (singularKey: string, pluralKey: string, value: number) =>
    value === 1 ? t(singularKey) : t(pluralKey);

  if (durationInSeconds >= secondsInAYear && durationInSeconds % secondsInAYear === 0) {
    const value = durationInSeconds / secondsInAYear;
    return `${value} ${label("duration.year", "duration.years", value)}`;
  }
  if (durationInSeconds >= secondsInAWeek && durationInSeconds % secondsInAWeek === 0) {
    const value = durationInSeconds / secondsInAWeek;
    return `${value} ${label("duration.week", "duration.weeks", value)}`;
  }
  if (durationInSeconds >= secondsInADay && durationInSeconds % secondsInADay === 0) {
    const value = durationInSeconds / secondsInADay;
    return `${value} ${label("duration.day", "duration.days", value)}`;
  }
  if (durationInSeconds >= secondsInAnHour && durationInSeconds % secondsInAnHour === 0) {
    const value = durationInSeconds / secondsInAnHour;
    return `${value} ${label("duration.hour", "duration.hours", value)}`;
  }
  if (durationInSeconds >= secondsInAMinute && durationInSeconds % secondsInAMinute === 0) {
    const value = durationInSeconds / secondsInAMinute;
    return `${value} ${label("duration.minute", "duration.minutes", value)}`;
  }
  const seconds = Math.round(durationInSeconds);
  return `${seconds} ${label("duration.second", "duration.seconds", seconds)}`;
};
