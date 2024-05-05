"use client";

import { useEffect, useState } from "react";

interface Props {
  date: Date;
}

export default function DateDisplay({ date }: Props) {
  const [dateAsString, setDateAsString] = useState<string | null>(null);
  useEffect(() => {
    setDateAsString(date.toLocaleDateString());
  }, [date]);

  return dateAsString;
}
