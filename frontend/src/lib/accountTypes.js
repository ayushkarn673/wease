import {
  BadgeIndianRupee,
  Banknote,
  Building2,
  CalendarCheck2,
  ClipboardList,
  House,
  ListChecks,
  MapPin,
  MapPinned,
  UsersRound,
  Wrench,
} from "lucide-react";

// The three ways to use Wease, keyed by the `role` query parameter of /register.
// Used by the sign-up chooser, the sign-up and login pages, and the home page.
export const ACCOUNT_TYPES = {
  customer: {
    role: "CUSTOMER",
    icon: House,
    short: "Customer",
    choice: "I need a service",
    choiceText: "Book electricians, plumbers, cleaners and more near you.",
    title: "Create your account",
    subtitle: "Book trusted local professionals in a few taps.",
    panel: {
      heading: "Home services, without the hassle.",
      text: "Book skilled local professionals — electricians, plumbers, carpenters and more.",
      points: [
        { icon: BadgeIndianRupee, title: "Clear visiting charges", text: "See what a visit costs before you book." },
        { icon: CalendarCheck2, title: "Book on your schedule", text: "Choose the date and time that suits you." },
        { icon: ListChecks, title: "Every job in one place", text: "Follow each booking from request to done." },
      ],
    },
  },
  worker: {
    role: "WORKER",
    icon: Wrench,
    short: "Professional",
    choice: "I'm a professional",
    choiceText: "Electrician, plumber, carpenter, painter… Get jobs from customers near you.",
    title: "Join as a professional",
    subtitle: "Get booking requests from customers near you.",
    next: "your service, experience and the area you work in",
    panel: {
      heading: "More work, close to home.",
      text: "Customers within 10 km of your base find you and book you directly.",
      points: [
        { icon: MapPin, title: "Jobs near you", text: "You only get requests inside your 10 km service area." },
        { icon: ClipboardList, title: "Your prices", text: "Set your visiting charge and quote each job after inspecting it." },
        { icon: Banknote, title: "Paid after the job", text: "Customers pay you in cash. A small fee applies to labour only, never to materials." },
      ],
    },
  },
  firm: {
    role: "FIRM",
    icon: Building2,
    short: "Labour firm",
    choice: "I run a labour firm",
    choiceText: "Supply crews of labourers, masons, carpenters and more, paid per worker per day.",
    title: "Register your labour firm",
    subtitle: "Get crew requests from customers in your city.",
    next: "your firm's details, team size and daily rates",
    panel: {
      heading: "Keep your crews busy.",
      text: "Customers ask for a crew — how many workers, for how many days — and see your rates upfront.",
      points: [
        { icon: UsersRound, title: "Crew requests", text: "Shifting, construction and site work, sent straight to you." },
        { icon: BadgeIndianRupee, title: "Your daily rates", text: "Set a rate per worker per day for each skill you supply." },
        { icon: MapPinned, title: "Your cities", text: "Cover your whole city, or choose the cities you serve." },
      ],
    },
  },
};

export const ACCOUNT_TYPE_KEYS = Object.keys(ACCOUNT_TYPES);
