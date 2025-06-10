"use client";

import { StartAndEndDate } from "@/lib/date-range";
import { useSearchParams } from "next/navigation";
import { Suspense, use } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ButtonLink } from "./button-link";
import DateDisplay from "./date";

interface Props {
  dates: Promise<StartAndEndDate>;
}

export const DateNavigation = ({ dates }: Props) => {
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
      <ButtonLink size="sm" href={`.?${createRedirectLink(offset - 1)}`}>
        <FaArrowLeft />
      </ButtonLink>
      <ButtonLink
        size="sm"
        className="w-32"
        href={`.?${createRedirectLink(0)}`}
      >
        <Suspense>
          <TodaysDate datePromise={dates} />
        </Suspense>
      </ButtonLink>
      <ButtonLink size="sm" href={`.?${createRedirectLink(offset + 1)}`}>
        <FaArrowRight />
      </ButtonLink>
    </div>
  );
};

export const TodaysDate = ({
  datePromise,
}: {
  datePromise: Promise<StartAndEndDate>;
}) => {
  const { start, end } = use(datePromise);
  return (
    <>
      <DateDisplay date={start} /> - <DateDisplay date={end} />
    </>
  );
};
