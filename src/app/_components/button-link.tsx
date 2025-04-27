import { Button, cn } from "@heroui/react";
import Link from "next/link";
import { ComponentProps } from "react";
import { LinkStatusLoader } from "./link-status-loader";

type LinkButtonProps = ComponentProps<typeof Button<typeof Link>>;

type Props = LinkButtonProps & {
  showLoader?: boolean;
};

export const ButtonLink = ({
  children,
  showLoader = true,
  className,
  ...props
}: Props) => {
  return (
    <Button as={Link} className={cn("w-9 min-w-9", className)} {...props}>
      {showLoader ? <LinkStatusLoader>{children}</LinkStatusLoader> : children}
    </Button>
  );
};
