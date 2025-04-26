import NextLink, { LinkProps } from "next/link";
import { useProgressContext } from "../_contexts/progress";

export const Link = (props: LinkProps) => {
  const { start: startProgress } = useProgressContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigateHandler = (e: any) => {
    startProgress();

    const { onNavigate } = props;
    if (onNavigate) {
      onNavigate(e);
    }
  };

  return <NextLink {...props} onNavigate={navigateHandler} />;
};
