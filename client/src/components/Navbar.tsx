import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#470B10] shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">

        <h1 className="text-2xl font-bold text-white">
          CareerPilot
        </h1>

        <div className="flex gap-8 text-white font-medium">

          <Link
            to="/"
            className="transition hover:text-[#DBC1B2]"
          >
            Career Intelligence
          </Link>

          <Link
            to="/job-tracker"
            className="transition hover:text-[#DBC1B2]"
          >
            Job Tracker
          </Link>

        </div>

      </div>
    </nav>
  );
}