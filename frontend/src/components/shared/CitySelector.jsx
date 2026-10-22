import { useState } from "react";
import { Check, ChevronDown, Crosshair, Loader2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITIES } from "@/lib/cities";
import { useCity } from "../../context/city";
import LocationPickerDialog from "../map/LocationPickerDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// "📍 Baner, Pune ▾" picker in the top bar. An exact location shows professionals whose 10 km area
// covers it; a city shows everyone in that city (and is used for labour firms).
export default function CitySelector({ className }) {
  const { city, setCity, saving, location, setLocation } = useCity();
  const [pickerOpen, setPickerOpen] = useState(false);
  const label = location?.label ?? city ?? "All cities";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Location: ${label}. Change location`}
            className={cn(
              "inline-flex h-9 min-w-0 max-w-[9.5rem] items-center sm:max-w-44 gap-1.5 rounded-full border border-neutral-200 bg-white pl-2.5 pr-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50",
              className
            )}
          >
            {saving ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-brand-700" />
            ) : location ? (
              <Crosshair className="size-4 shrink-0 text-blue-600" />
            ) : (
              <MapPin className="size-4 shrink-0 text-brand-700" />
            )}
            <span className="truncate">{label}</span>
            <ChevronDown className="size-3.5 shrink-0 text-neutral-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuItem onSelect={() => setPickerOpen(true)} className="font-semibold text-blue-700">
            <Crosshair className="size-4" />
            {location ? "Change my location" : "Set my exact location"}
          </DropdownMenuItem>
          {location && (
            <DropdownMenuItem onSelect={() => setLocation(null)}>
              <X className="size-4" />
              Clear location ({location.label})
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-medium text-neutral-500">Or browse a city</DropdownMenuLabel>
          <CityItem label="All cities" selected={!location && !city} onSelect={() => { setLocation(null); setCity(null); }} />
          {CITIES.map((name) => (
            <CityItem key={name} label={name} selected={!location && city === name} onSelect={() => { setLocation(null); setCity(name); }} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <LocationPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        initial={location}
        fallbackCity={city}
        title="Where do you need help?"
        description="We'll show professionals whose 10 km service area covers this spot. Your location stays in this browser."
        onConfirm={setLocation}
      />
    </>
  );
}

function CityItem({ label, selected, onSelect }) {
  return (
    <DropdownMenuItem onSelect={onSelect} className={cn("justify-between", selected && "font-semibold text-brand-700")}>
      {label}
      {selected && <Check className="size-4" />}
    </DropdownMenuItem>
  );
}
