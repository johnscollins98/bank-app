"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DateDisplay from "./date";

interface Props {
  start: Date;
  end: Date;
}

export const DateNavigation = ({ start, end }: Props) => {
  const searchParams = useSearchParams();

  const parsedOffsetParam = parseInt(searchParams.get("offset") ?? "0");
  const offset = Number.isNaN(parsedOffsetParam) ? 0 : parsedOffsetParam;

  const createRedirectLink = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newOffset) {
      params.set("offset", newOffset.toString());
    } else {
      params.delete("offset");
    }
    return params.toString();
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        className="min-w-0"
        as={Link}
        prefetch
        href={`.?${createRedirectLink(offset - 1)}`}
      >
        <FaArrowLeft />
      </Button>
      <Button size="sm" as={Link} prefetch href={`.?${createRedirectLink(0)}`}>
        <DateDisplay date={start} /> - {<DateDisplay date={end} />}
      </Button>
      <Button
        size="sm"
        as={Link}
        prefetch
        className="min-w-0"
        href={`.?${createRedirectLink(offset + 1)}`}
      >
        <FaArrowRight />
      </Button>
    </div>
  );
};
