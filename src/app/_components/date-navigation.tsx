"use client";

import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ButtonLink } from "./button-link";
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
      <ButtonLink
        size="sm"
        prefetch
        href={`.?${createRedirectLink(offset - 1)}`}
      >
        <FaArrowLeft />
      </ButtonLink>
      <ButtonLink
        size="sm"
        className="w-32"
        prefetch
        href={`.?${createRedirectLink(0)}`}
      >
        <DateDisplay date={start} /> - {<DateDisplay date={end} />}
      </ButtonLink>
      <ButtonLink
        size="sm"
        prefetch
        href={`.?${createRedirectLink(offset + 1)}`}
      >
        <FaArrowRight />
      </ButtonLink>
    </div>
  );
};
