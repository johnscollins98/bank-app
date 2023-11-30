"use client";

import { useEffect, useState } from 'react';

interface Props {
  date: Date;
}

export default function TimeDisplay({ date }: Props) {
  const [dateAsString, setDateAsString] = useState<string | null>(null);
  useEffect(() => {
    setDateAsString(date.toLocaleTimeString(undefined, { timeStyle: 'short' }));
  }, [date]);

  return dateAsString;
}