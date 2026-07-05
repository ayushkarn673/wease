export default function Services() {
  const services = [
    {
      title: "For Customers",
      desc: "Find and book local verified workers in minutes. Browse transparent ratings, read reviews, and pay securely.",
      color: "bg-blue-500",
    },
    {
      title: "For Workers",
      desc: "Build your profile, display your skills, choose your own hours, and find high-quality local clients instantly.",
      color: "bg-teal-500",
    },
    {
      title: "Secure Verification",
      desc: "All background checks and qualifications are meticulously audited so you can connect and build with total peace of mind.",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Designed for Seamless Collaboration
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Wease provides a modern, secure, and user-friendly marketplace that empowers both clients and service professionals.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {services.map((card) => (
          <div
            key={card.title}
            className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="font-bold text-xl text-slate-900 dark:text-white">{card.title}</div>
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</div>
            <div className="mt-6 flex items-center">
              <div className={`h-1.5 w-12 rounded-full ${card.color} opacity-80 group-hover:w-20 transition-all duration-300`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
