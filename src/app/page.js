import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-6">
      <main className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Company System
          </h1>

          <Link
            href="/login"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Login
          </Link>
        </header>

        {/* Hero Section */}
        <section className="mt-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
              Simple Internal
              <br />
              Company Management
            </h2>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
              Manage clients, orders, payments, and dues in one place.
              Designed for small teams with role-based dashboards for
              Admins, Managers, and Users.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/login"
                className="rounded-full bg-black px-6 py-3 text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black"
              >
                Get Started
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-zinc-300 px-6 py-3 font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <Image
              src="/dashboard.png"
              alt="Dashboard Preview"
              width={420}
              height={300}
              className="rounded-xl shadow-lg dark:shadow-zinc-800"
              priority
            />
          </div>
        </section>

        {/* Features */}
        <section className="mt-24 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {[
            "Admin Dashboard",
            "Manager Control",
            "Payment Tracking",
            "Role-Based Access",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {feature}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Simple and secure management
              </p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-24 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Company Internal System
        </footer>
      </main>
    </div>
  );
}
