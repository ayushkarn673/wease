import { useState } from "react";
import { cn } from "@/lib/utils";
import { professionLabel } from "@/lib/format";
import { serviceImage } from "@/lib/media";
import ServiceArt from "./ServiceArt";

// Photo for a service category. Falls back to the icon illustration when there is no photo
// or it fails to load.
export default function ServiceImage({ profession, width = 600, className, iconClassName, children }) {
  const src = serviceImage(profession, width);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <ServiceArt profession={profession} className={className} iconClassName={iconClassName}>
        {children}
      </ServiceArt>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-neutral-100", className)}>
      <img
        src={src}
        alt={`${professionLabel(profession)} at work`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="absolute inset-0 size-full object-cover"
      />
      {children}
    </div>
  );
}
