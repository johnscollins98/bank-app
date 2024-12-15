"use client";

interface Props {
  date: Date;
}

export default function DateDisplay({ date }: Props) {
  const dateAsString = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

  // suppress hydration warning due to local date display settings
  return <div suppressHydrationWarning>{dateAsString}</div>;
}
