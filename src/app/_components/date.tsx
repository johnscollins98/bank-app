"use client";

interface Props {
  date: Date;
  locales?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
}

export default function DateDisplay({
  date,
  locales,
  options = { day: "numeric", month: "short" },
}: Props) {
  const dateAsString = date.toLocaleDateString(locales, options);

  // suppress hydration warning due to local date display settings
  return <div suppressHydrationWarning>{dateAsString}</div>;
}
