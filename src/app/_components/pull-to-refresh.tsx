"use client";
import { Spinner } from "@heroui/react";
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
      className="fixed inset-x-1/2 z-[99] h-8 w-8 -translate-x-1/2 rounded-full bg-default-100 p-2 shadow"
    >
      <div className={`flex h-full w-full items-center justify-center`}>
        <Spinner size="sm" />
      </div>
    </div>
  );
};
