import React from "react";
import cn from "clsx";
import styles from "./Toast.module.scss";
import { handleColor } from "../../../src/color";
import type { ColorValue } from "../../../src/types";

const cardTypeClasses = {
  raised: styles["toast--raised"],
  outlined: styles["toast--outlined"],
  flat: styles["toast--flat"]
};

interface ToastProps {
  variant?: keyof typeof cardTypeClasses;
  band?: ColorValue;
  dismissible?: boolean;
  dismissed?: boolean;
  timeToLive?: number;
  animationTime?: number;
  children?: React.ReactNode;
  eject: () => void;
}

const Toast = ({
  variant = "raised",
  band,
  dismissible = true,
  dismissed = false,
  timeToLive,
  animationTime = 200,
  children,
  eject
}: ToastProps): JSX.Element => {
  const [animating, setAnimating] = React.useState(false);

  const classes = {
    [styles["toast--banded"]]: Boolean(band),
    [styles["toast--dismissed"]]: animating,
    [styles["toast--has-timer"]]: Boolean(timeToLive)
  };

  React.useEffect(() => {
    if (!animating) return;

    const timeout = window.setTimeout(() => {
      eject();
    }, animationTime);

    return () => window.clearTimeout(timeout);
  }, [animating]);

  const handleClick = () => {
    if (dismissible) setAnimating(true);
  };

  React.useEffect(() => {
    if (!dismissed) return;
    setAnimating(true);
  }, [dismissed]);

  React.useEffect(() => {
    if (!timeToLive) return;
    const timeout = window.setTimeout(() => setAnimating(true), timeToLive);
    return () => window.clearTimeout(timeout);
  }, [timeToLive]);

  return (
    <div
      className={cn(styles["toast"], cardTypeClasses[variant], classes)}
      onClick={handleClick}
      style={
        {
          "--band-color": handleColor(band),
          "--animation-time": `${animationTime}ms`
        } as React.CSSProperties
      }
    >
      {children}
      <div
        className={styles["toast__timer"]}
        style={{ "--ttl": `${timeToLive}ms` } as React.CSSProperties}
      ></div>
    </div>
  );
};

export default Toast;