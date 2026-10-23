import { CalendarDays, Clock, MapPin, Navigation } from "lucide-react";
import { formatDate, formatTime, professionLabel } from "@/lib/format";
import { directionsUrl } from "@/lib/geo";
import UserAvatar from "../shared/UserAvatar";
import PinMap from "../map/PinMap";
import SectionHeader from "../shared/SectionHeader";

const ON_THE_WAY = ["ACCEPTED", "IN_PROGRESS"];

export default function BookingDetailsCard({ booking, role }) {
  const hasPin = booking.serviceLatitude != null && booking.serviceLongitude != null;
  // Once a professional has accepted, they get one tap to Google Maps, which shows the route, distance and time.
  const canNavigate = role === "WORKER" && hasPin && ON_THE_WAY.includes(booking.status);

  return (
    <div className="space-y-6">
      <section>
        <SectionHeader title="People" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Person label="Professional" name={booking.workerName} detail={professionLabel(booking.profession)} />
          <Person label="Customer" name={booking.customerName} />
        </div>
      </section>

      <section>
        <SectionHeader title="Schedule" />
        <ul className="space-y-3">
          <Item
            icon={CalendarDays}
            label="Date"
            value={formatDate(booking.bookingDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          />
          <Item icon={Clock} label="Time" value={formatTime(booking.bookingTime)} />
          <Item icon={MapPin} label="Address" value={booking.serviceAddress} />
        </ul>
        {canNavigate && (
          <a
            href={directionsUrl(booking.serviceLatitude, booking.serviceLongitude, { navigate: true })}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-700 p-4 text-white transition hover:bg-brand-800"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Navigation className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">Navigate in Google Maps</span>
              <span className="block text-sm text-white/75">Route, distance and travel time from where you are</span>
            </span>
          </a>
        )}
        {hasPin && (
          <div className="mt-3">
            <PinMap lat={booking.serviceLatitude} lng={booking.serviceLongitude} showDirections={!canNavigate} />
          </div>
        )}
      </section>

      {booking.description && (
        <section>
          <SectionHeader title="Job description" />
          <p className="whitespace-pre-line rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm leading-relaxed text-neutral-700">
            {booking.description}
          </p>
        </section>
      )}

    </div>
  );
}

function Person({ label, name, detail }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4">
      <UserAvatar name={name} />
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="truncate font-semibold text-neutral-900">{name}</p>
        {detail && <p className="text-sm text-neutral-500">{detail}</p>}
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, value }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="font-medium text-neutral-900">{value}</p>
      </div>
    </li>
  );
}
