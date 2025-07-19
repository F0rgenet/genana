"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

interface LetterAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  name: string;
}

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const colors = [
  "bg-red-500", "bg-pink-500", "bg-purple-500",
  "bg-indigo-500", "bg-blue-500", "bg-cyan-500",
  "bg-teal-500", "bg-green-500", "bg-lime-500",
  "bg-amber-500", "bg-orange-500", "bg-rose-500",
];

const LetterAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  LetterAvatarProps
>(({ className, name, ...props }, ref) => {
  const safeName = name || "";
  const firstLetter = safeName.charAt(0).toUpperCase() || "?";
  const hash = stringToHash(safeName);
  const colorClass = colors[Math.abs(hash) % colors.length] || "bg-gray-500";

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      <AvatarPrimitive.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full text-white font-bold",
          colorClass
        )}
        delayMs={0}
      >
        {firstLetter}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});
LetterAvatar.displayName = "LetterAvatar";

export { LetterAvatar }
