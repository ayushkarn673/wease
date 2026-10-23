import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeIndianRupee, Building2, CalendarClock, ChevronRight, ClipboardCheck, ClipboardList, Crosshair, Loader2, MapPin, Search, Wallet } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { usePolling } from "../../hooks/usePolling";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/city";
import { getAvailableWorkers } from "../../services/workerService";
import { getCustomerBookings } from "../../services/bookingService";
import { describePlace } from "../../services/geocode";
import { ACTIVE_STATUSES, firstName } from "@/lib/format";
import { SERVICE_RADIUS_KM, isInIndia } from "@/lib/geo";
import { MARKETING_PHOTOS, unsplashUrl } from "@/lib/media";
import { ACCOUNT_TYPES } from "@/lib/accountTypes";
import WorkerCard from "../../components/customer/WorkerCard";
import BookingCard from "../../components/booking/BookingCard";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import WorkersMap from "../../components/map/WorkersMap";
import LocationPickerDialog from "../../components/map/LocationPickerDialog";
import { CardGridSkeleton, EmptyState, ErrorState, ListSkeleton } from "../../components/shared/States";

async function loadUpcomingBookings() {
  const all = await getCustomerBookings();
  return all
    .filter((b) => ACTIVE_STATUSES.includes(b.status))
    .sort((a, b) => `${a.bookingDate}${a.bookingTime}`.localeCompare(`${b.bookingDate}${b.bookingTime}`))
    .slice(0, 3);
}

const noResults = async () => [];

const PROMISES = [
  { icon: BadgeIndianRupee, text: "Visiting charge shown upfront" },
  { icon: ClipboardCheck, text: "You approve the quote first" },
  { icon: Wallet, text: "Pay after the job" },
];

// The start page, kept simple: search, who's available around you (list + map), crews, and your bookings.
export default function CustomerDashboard() {
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const navigate = useNavigate();
  const { location, setLocation, city } = useCity();
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  // Only professionals whose 10 km service area covers the visitor's location.
  const loadNearby = useCallback(
    () => (location ? getAvailableWorkers({ lat: location.lat, lng: location.lng }) : noResults()),
    [location]
  );
  const { status: nearbyStatus, data: nearby = [], reload: reloadNearby } = useAsync(loadNearby);
  const { status: bookingsStatus, data: bookings = [], reload: reloadBookings, refresh: refreshBookings } = useAsync(
    isCustomer ? loadUpcomingBookings : noResults
  );
  usePolling(refreshBookings, 15000, isCustomer && bookingsStatus === "ready");

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/workers${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  function locateMe() {
    if (!navigator.geolocation) return setLocateError("This browser can't share your location. Choose it on the map instead.");
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (!isInIndia(coords.latitude, coords.longitude)) {
          setLocating(false);
          return setLocateError("Wease works in India only. Choose a location on the map instead.");
        }
        const label = (await describePlace(coords.latitude, coords.longitude).catch(() => null)) ?? "Current location";
        setLocation({ lat: coords.latitude, lng: coords.longitude, label });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocateError("Couldn't get your location. Allow location access, or choose it on the map.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="space-y-10">
      {/* Search */}
      <HeroPanel image={unsplashUrl(MARKETING_PHOTOS.cleaning, 1200)}>
        <p className="text-sm text-white/70">{isCustomer ? "Welcome back" : `Trusted local professionals${city ? ` in ${city}` : ""}`}</p>
        <h1 className="mt-1 max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
          {isCustomer ? `Hi ${firstName(user.fullName)}, what needs fixing?` : "What needs fixing today?"}
        </h1>

        <form onSubmit={handleSearch} className="mt-6 flex max-w-lg items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lg shadow-black/10">
          <Search className="size-5 shrink-0 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search professionals by name"
            aria-label="Search professionals by name"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <button type="submit" className="h-11 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800">
            Search
          </button>
        </form>

        <div className="mt-3 flex max-w-lg flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80">
          <MapPin className="size-4 shrink-0 text-white/70" />
          {location ? (
            <span className="min-w-0 truncate">
              Searching around <span className="font-semibold text-white">{location.label}</span>
            </span>
          ) : (
            <span>Set your location to see who&apos;s available near you</span>
          )}
          <button type="button" onClick={() => setPickerOpen(true)} className="font-semibold text-white underline-offset-4 hover:underline">
            {location ? "Change" : "Set location"}
          </button>
        </div>

        {isCustomer ? (
          <Link
            to="/customer/bookings"
            className="mt-4 flex max-w-lg items-center gap-4 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm transition hover:bg-white/15"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700">
              <ClipboardList className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Your bookings, in one place</span>
              <span className="block text-sm text-white/70">Track requests, confirmations and completed jobs</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-white/70" />
          </Link>
        ) : (
          <ul className="mt-5 flex max-w-lg flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-white/70" />
                {text}
              </li>
            ))}
          </ul>
        )}
      </HeroPanel>

      {/* Available around you */}
      <section>
        <SectionHeader
          title="Available near you"
          subtitle={location ? `Within ${SERVICE_RADIUS_KM} km of ${location.label}` : `Professionals serve within ${SERVICE_RADIUS_KM} km of their base`}
          to={location ? "/workers" : undefined}
        />

        {!location && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Crosshair className="size-6" />
            </span>
            <p className="mt-4 font-semibold text-neutral-900">Where do you need help?</p>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">We&apos;ll show professionals who are available and serve your area, on a list and a map.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={locateMe}
                disabled={locating}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
              >
                {locating ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
                Use my current location
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="h-10 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700"
              >
                Choose on map
              </button>
            </div>
            {locateError && <p className="mt-3 text-sm font-medium text-red-600">{locateError}</p>}
          </div>
        )}

        {location && nearbyStatus === "loading" && <CardGridSkeleton count={2} />}
        {location && nearbyStatus === "error" && <ErrorState message="We couldn't load professionals near you." onRetry={reloadNearby} />}
        {location && nearbyStatus === "ready" && nearby.length === 0 && (
          <EmptyState
            icon={MapPin}
            title={`No one available near ${location.label} yet`}
            description="Try a nearby area, or hire a crew from a labour firm below."
            action={
              <button type="button" onClick={() => setPickerOpen(true)} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                Change area
              </button>
            }
          />
        )}
        {location && nearbyStatus === "ready" && nearby.length > 0 && (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <WorkersMap workers={nearby} location={location} className="h-80 lg:h-[26rem]" />
            <div className="border-t border-neutral-200/80">
              {nearby.slice(0, 4).map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))}
              {nearby.length > 4 && (
                <Link to="/workers" className="flex items-center justify-center gap-1 py-4 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  See all {nearby.length} nearby
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Need several workers */}
      <Link
        to="/firms"
        className="group flex items-center gap-4 rounded-2xl bg-slate-900 p-5 text-white transition hover:bg-slate-800 sm:p-6"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Building2 className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold sm:text-lg">Need several workers?</span>
          <span className="block text-sm text-white/70">
            Hire a crew from a labour firm{city ? ` in ${city}` : ""} for shifting, construction or site work.
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-white/60 transition group-hover:translate-x-0.5" />
      </Link>

      {/* Ways to earn with Wease, for visitors who aren't signed in */}
      {!user && (
        <section>
          <SectionHeader title="Work with Wease" subtitle="Get jobs from customers near you" />
          <div className="grid gap-3 sm:grid-cols-2">
            {["worker", "firm"].map((key) => {
              const { icon: Icon, title, choiceText } = ACCOUNT_TYPES[key];
              return (
                <Link
                  key={key}
                  to={`/register?role=${key}`}
                  className="group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 transition hover:border-brand-500 hover:shadow-sm"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-neutral-900">{title}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-neutral-500">{choiceText}</span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming bookings */}
      {isCustomer && (
        <section>
          <SectionHeader title="Upcoming bookings" to="/customer/bookings" />
          {bookingsStatus === "loading" && <ListSkeleton rows={2} />}
          {bookingsStatus === "error" && <ErrorState message="We couldn't load your bookings." onRetry={reloadBookings} />}
          {bookingsStatus === "ready" && bookings.length === 0 && (
            <EmptyState icon={CalendarClock} title="No upcoming bookings" description="When you book a professional, it shows up here." />
          )}
          {bookingsStatus === "ready" && bookings.length > 0 && (
            <div className="grid gap-3 lg:grid-cols-2">
              {bookings.map((b) => (
                <BookingCard key={b.bookingId} booking={b} />
              ))}
            </div>
          )}
        </section>
      )}

      <LocationPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        initial={location}
        fallbackCity={city}
        title="Where do you need help?"
        description={`We'll show professionals whose ${SERVICE_RADIUS_KM} km service area covers this spot. Your location stays in this browser.`}
        onConfirm={setLocation}
      />
    </div>
  );
}
