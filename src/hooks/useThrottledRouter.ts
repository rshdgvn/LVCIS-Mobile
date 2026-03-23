import { Href, useRouter } from "expo-router";
import { useRef } from "react";

export function useThrottledRouter() {
  const router = useRouter();
  const isNavigating = useRef(false);

  const push = (href: Href) => {
    if (isNavigating.current) return;

    isNavigating.current = true;
    
    router.push(href);

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  return {
    ...router,
    push,
  };
}