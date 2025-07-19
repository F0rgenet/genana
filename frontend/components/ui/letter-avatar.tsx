"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

interface LetterAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  name: string;
}

// A simple hashing function to get a number from a string
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// A palette of good-looking, accessible colors
const colors = [
  "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-deep-purple-500",
  "bg-indigo-500", "bg-blue-500", "bg-light-blue-500", "bg-cyan-500",
  "bg-teal-500", "bg-green-500", "bg-light-green-500", "bg-lime-500",
  "bg-amber-500", "bg-orange-500", "bg-deep-orange-500", "bg-brown-500",
];

const LetterAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  LetterAvatarProps
>(({ className, name, ...props }, ref) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
  
  // Get a consistent color based on the name
  const hash = stringToHash(name || "");
  const colorClass = colors[Math.abs(hash) % colors.length];

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      <div className={cn("flex h-full w-full items-center justify-center rounded-full text-white font-bold", colorClass)}>
        {firstLetter}
      </div>
    </AvatarPrimitive.Root>
  )
});
LetterAvatar.displayName = "LetterAvatar"

export { LetterAvatar }
