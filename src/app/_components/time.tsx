"use client";

interface Props {
  date: Date;
}

export default function TimeDisplay({ date }: Props) {
  const dateAsString = date.toLocaleTimeString(undefined, {
    timeStyle: "short",
  });

  // suppress hydration warning due to local date display settings
  return <div suppressHydrationWarning>{dateAsString}</div>;
}
