import * as React from "react";

import { getAvatarTone, getInitials } from "@/lib/avatar";
import { cn } from "@/lib/cn";

const sizeClasses = {
  xs: "size-7 text-[10px]",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
} as const;

export type AvatarProps = React.ComponentProps<"span"> & {
  name: string;
  src?: string | null;
  size?: keyof typeof sizeClasses;
};

function Avatar({
  name,
  src,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold tracking-wide ring-2",
        sizeClasses[size],
        getAvatarTone(name),
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt=""
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}

export { Avatar };
