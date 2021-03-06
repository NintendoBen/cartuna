import React, { ReactNode, useCallback, useContext } from "react";

import { RouterContext } from "./Router";

interface LinkProps {
  children: ReactNode;
  href: string;
}

function Link({ children, href, ...props }: LinkProps) {
  const routerContext = useContext(RouterContext);

  const onClickHandler = useCallback(
    (event) => {
      event.preventDefault();

      if (href === routerContext.location.pathname) return;

      routerContext.pushState(null, "", href);
    },
    [href, routerContext]
  );

  return (
    <a href={href} onClick={onClickHandler} {...props}>
      {children}
    </a>
  );
}

export default Link;
