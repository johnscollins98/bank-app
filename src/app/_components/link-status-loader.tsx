import { Spinner } from "@heroui/react";
import { useLinkStatus } from "next/link";
import { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<typeof Spinner> & {
  children: ReactNode;
};

export const LinkStatusLoader = ({ children, ...props }: Props) => {
  const linkStatus = useLinkStatus();

  if (linkStatus.pending) {
    return <Spinner size="sm" {...props} />;
  }

  return children;
};
