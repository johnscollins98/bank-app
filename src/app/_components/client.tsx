"use client";

import { PropsWithChildren, useEffect, useState } from 'react';

export default function Client({ children }: PropsWithChildren) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  return isMounted ? children : null;
}