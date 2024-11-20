"use client";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { usePullToRefresh } from "use-pull-to-refresh";

const MAXIMUM_PULL_LENGTH = 240;
const REFRESH_THRESHOLD = 180;

export const PullToRefresh = () => {
  const { refresh } = useRouter();

  const { isRefreshing, pullPosition } = usePullToRefresh({
    onRefresh: refresh,
    maximumPullLength: MAXIMUM_PULL_LENGTH,
    refreshThreshold: REFRESH_THRESHOLD,
  });

  return (
    <div
      style={{
        top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 3,
        opacity: isRefreshing || pullPosition > 0 ? 1 : 0,
      }}
      className="bg-base-500 z-99 fixed inset-x-1/2 h-8 w-8 -translate-x-1/2 rounded-full p-2 shadow"
    >
      <div className={`h-full w-full`}>
        <Spinner />
      </div>
    </div>
  );
};
