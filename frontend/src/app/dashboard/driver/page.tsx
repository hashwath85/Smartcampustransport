"use client";

import { useState } from "react";
import {
  Bus,
  MapPin,
  Navigation,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertTriangle,
  LogOut,
  X,
  Send,
} from "lucide-react";

type TripStatus = "notStarted" | "running" | "ended";

type StudentStatus = "Verified" | "Waiting" | "Not Coming";

type Student = {
  name: string;
  stop: string;
  status: StudentStatus;
};

const students: Student[] = [
  {
    name: "Dharshana K M",
    stop: "Ambattur OT",
    status: "Verified",
  },
  {
    name: "Arun Kumar",
    stop: "Ambattur",
    status: "Verified",
  },
  {
    name: "Rahul M",
    stop: "Mogappair",
    status: "Waiting",
  },
  {
    name: "Priya S",
    stop: "Padi",
    status: "Not Coming",
  },
  {
    name: "Nandhini R",
    stop: "Anna Nagar",
    status: "Waiting",
  },
];

export default function DriverDashboard() {
  const [tripStatus, setTripStatus] =
    useState<TripStatus>("notStarted");

  const [gpsActive, setGpsActive] = useState(false);

  const [showBreakdown, setShowBreakdown] =
    useState(false);

  const [breakdownType, setBreakdownType] =
    useState("Engine Problem");

  const [breakdownDescription, setBreakdownDescription] =
    useState("");

  // NEW: Alternative bus
  const [alternativeBus, setAlternativeBus] =
    useState("BUS-15");

  const [breakdownSubmitted, setBreakdownSubmitted] =
    useState(false);

  const [breakdownTime, setBreakdownTime] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const startTrip = () => {
    setTripStatus("running");
    setGpsActive(true);
  };

  const endTrip = () => {
    setTripStatus("ended");
    setGpsActive(false);
  };

  // BREAKDOWN SUBMISSION
  const submitBreakdown = () => {
    if (!breakdownDescription.trim()) {
      setErrorMessage(
        "Please enter a description of the breakdown."
      );
      return;
    }

    if (alternativeBus === "BUS-12") {
      setErrorMessage(
        "Alternative bus cannot be the broken bus."
      );
      return;
    }

    const currentTime = new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const breakdownData = {
      originalBus: "BUS-12",
      alternativeBus: alternativeBus,
      breakdownType: breakdownType,
      description: breakdownDescription,
      time: currentTime,
      message: `Your bus BUS-12 has broken down. This bus will not come to your route. Alternative bus ${alternativeBus} has been arranged.`,
    };

    /*
      FRONTEND DEMO

      Store the breakdown information so the
      Student Dashboard can read it.

      Later this will be replaced by:
      Backend API + Firestore + FCM
    */

    localStorage.setItem(
      "smartCampusBreakdown",
      JSON.stringify(breakdownData)
    );

    setBreakdownTime(currentTime);
    setBreakdownSubmitted(true);
    setErrorMessage("");
  };

  const closeBreakdown = () => {
    setShowBreakdown(false);
    setBreakdownSubmitted(false);
    setBreakdownDescription("");
    setErrorMessage("");
  };

  const getStatusStyle = (
    status: StudentStatus
  ) => {
    if (status === "Verified") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Waiting") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-red-50 text-red-700";
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1F29]">

      {/* ================= NAVBAR ================= */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C3FC5]">
              <Bus
                size={24}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                Smart Campus Transport
              </h1>

              <p className="text-xs text-[#6B6B78]">
                Driver Portal
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold">
                Ravi Kumar
              </p>

              <p className="text-xs text-[#6B6B78]">
                Driver • BUS-12
              </p>

            </div>

            <button className="rounded-lg p-2 text-[#6B6B78] hover:bg-gray-100">
              <LogOut size={19} />
            </button>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">

        {/* GREETING */}

        <div>

          <h2 className="text-2xl font-bold">
            Hello, Ravi Kumar 👋
          </h2>

          <p className="mt-1 text-sm text-[#6B6B78]">
            Manage your trip and monitor student boarding.
          </p>

        </div>

        {/* ================= BUS CARD ================= */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0E9FF]">

                <Bus
                  size={28}
                  className="text-[#6C3FC5]"
                />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-[#6B6B78]">
                  Assigned Bus
                </p>

                <h3 className="text-xl font-bold">
                  BUS-12
                </h3>

                <p className="text-sm text-[#6B6B78]">
                  Ambattur → College
                </p>

              </div>

            </div>

            <div>

              {tripStatus === "notStarted" && (

                <button
                  onClick={startTrip}
                  className="flex items-center gap-2 rounded-xl bg-[#6C3FC5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4B2A87]"
                >
                  <Navigation size={18} />
                  Start Trip
                </button>

              )}

              {tripStatus === "running" && (

                <button
                  onClick={endTrip}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  <XCircle size={18} />
                  End Trip
                </button>

              )}

              {tripStatus === "ended" && (

                <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-600">
                  <CheckCircle2 size={18} />
                  Trip Ended
                </div>

              )}

            </div>

          </div>

          {/* TRIP STATUS */}

          <div className="mt-5 flex flex-wrap gap-3">

            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                tripStatus === "running"
                  ? "bg-green-50 text-green-700"
                  : tripStatus === "ended"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >

              <Clock3 size={14} />

              {tripStatus === "running"
                ? "Trip Running"
                : tripStatus === "ended"
                ? "Trip Completed"
                : "Trip Not Started"}

            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                gpsActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >

              <Navigation size={14} />

              GPS{" "}
              {gpsActive
                ? "Active"
                : "Standby"}

            </div>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <StatCard
            icon={<Users size={20} />}
            title="Students"
            value="5"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            title="Boarded"
            value="2"
            green
          />

          <StatCard
            icon={<Clock3 size={20} />}
            title="Waiting"
            value="2"
            yellow
          />

          <StatCard
            icon={<XCircle size={20} />}
            title="Not Coming"
            value="1"
            red
          />

        </section>

        {/* ================= LIVE MAP ================= */}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h3 className="font-semibold">
                Live Bus Location
              </h3>

              <p className="text-sm text-[#6B6B78]">
                GPS location of BUS-12
              </p>

            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                gpsActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >

              <span className="h-2 w-2 rounded-full bg-current" />

              {gpsActive
                ? "GPS Live"
                : "GPS Offline"}

            </div>

          </div>

          <div className="relative flex h-[330px] items-center justify-center overflow-hidden rounded-xl bg-[#F0E9FF]">

            <div className="absolute h-64 w-64 rounded-full border-2 border-dashed border-[#6C3FC5]/30" />

            <div className="absolute h-40 w-40 rounded-full border-2 border-dashed border-[#6C3FC5]/40" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#6C3FC5] shadow-lg">

              <Bus
                className="text-white"
                size={28}
              />

            </div>

            <div className="absolute bottom-6 left-6 rounded-xl bg-white px-4 py-3 shadow-md">

              <p className="text-xs text-[#6B6B78]">
                Current Route
              </p>

              <p className="text-sm font-semibold">
                Ambattur → College
              </p>

            </div>

          </div>

        </section>

        {/* ================= STUDENTS ================= */}

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-5">

            <h3 className="font-semibold">
              Student Boarding Status
            </h3>

            <p className="mt-1 text-sm text-[#6B6B78]">
              Status is updated through the boarding verification system.
            </p>

          </div>

          <div className="divide-y divide-gray-100">

            {students.map((student) => (

              <div
                key={student.name}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >

                <div>

                  <p className="font-medium">
                    {student.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-[#6B6B78]">

                    <MapPin size={13} />

                    {student.stop}

                  </div>

                </div>

                <div
                  className={`flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${getStatusStyle(
                    student.status
                  )}`}
                >

                  {student.status === "Verified" && (
                    <CheckCircle2 size={14} />
                  )}

                  {student.status === "Waiting" && (
                    <Clock3 size={14} />
                  )}

                  {student.status === "Not Coming" && (
                    <XCircle size={14} />
                  )}

                  {student.status}

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* ================= BREAKDOWN ================= */}

        <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <AlertTriangle
                  className="text-red-600"
                  size={24}
                />

              </div>

              <div>

                <h3 className="font-semibold">
                  Bus Breakdown
                </h3>

                <p className="mt-1 text-sm text-[#6B6B78]">
                  Report a breakdown and assign an alternative bus.
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setShowBreakdown(true)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >

              <AlertTriangle size={18} />

              Report Breakdown

            </button>

          </div>

          {/* SUCCESSFUL BREAKDOWN */}

          {breakdownTime && (

            <div className="mt-5 rounded-xl bg-red-50 p-4">

              <p className="font-semibold text-red-700">
                Breakdown Reported
              </p>

              <p className="mt-1 text-sm text-red-600">
                BUS-12 → Alternative{" "}
                {alternativeBus}
              </p>

              <p className="mt-1 text-xs text-red-500">
                Reported at {breakdownTime}
              </p>

            </div>

          )}

        </section>

      </main>

      {/* ================= BREAKDOWN MODAL ================= */}

      {showBreakdown && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>

                <h3 className="text-lg font-bold">
                  Report Bus Breakdown
                </h3>

                <p className="mt-1 text-xs text-[#6B6B78]">
                  BUS-12 will not continue on the route.
                </p>

              </div>

              <button
                onClick={closeBreakdown}
                className="rounded-lg p-2 hover:bg-gray-100"
              >

                <X size={20} />

              </button>

            </div>

            {/* FORM */}

            {!breakdownSubmitted ? (

              <div className="space-y-5 p-5">

                {/* BROKEN BUS */}

                <div className="rounded-xl bg-red-50 p-4">

                  <p className="text-xs font-medium text-red-500">
                    BROKEN BUS
                  </p>

                  <p className="mt-1 text-lg font-bold text-red-700">
                    BUS-12
                  </p>

                </div>

                {/* BREAKDOWN TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Breakdown Type
                  </label>

                  <select
                    value={breakdownType}
                    onChange={(e) =>
                      setBreakdownType(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6C3FC5]"
                  >

                    <option>
                      Engine Problem
                    </option>

                    <option>
                      Tyre Problem
                    </option>

                    <option>
                      Electrical Problem
                    </option>

                    <option>
                      Accident
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

                {/* ================= NEW ALTERNATIVE BUS ================= */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Alternative Bus Number
                  </label>

                  <select
                    value={alternativeBus}
                    onChange={(e) =>
                      setAlternativeBus(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#6C3FC5] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#6C3FC5]"
                  >

                    <option value="BUS-15">
                      BUS-15
                    </option>

                    <option value="BUS-21">
                      BUS-21
                    </option>

                    <option value="BUS-25">
                      BUS-25
                    </option>

                  </select>

                  <p className="mt-2 text-xs text-[#6B6B78]">
                    Students assigned to BUS-12 will be shown this bus.
                  </p>

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>

                  <textarea
                    value={breakdownDescription}
                    onChange={(e) =>
                      setBreakdownDescription(
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Describe the breakdown..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6C3FC5]"
                  />

                </div>

                {/* ERROR */}

                {errorMessage && (

                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                  </div>

                )}

                {/* WARNING */}

                <div className="flex gap-3 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">

                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>
                    BUS-12 will be marked unavailable
                    for this trip. Students will be
                    informed about the alternative bus.
                  </p>

                </div>

                {/* SUBMIT */}

                <button
                  onClick={submitBreakdown}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                >

                  <Send size={18} />

                  Report Breakdown & Assign Bus

                </button>

              </div>

            ) : (

              /* ================= SUCCESS ================= */

              <div className="p-8 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">

                  <CheckCircle2
                    className="text-green-600"
                    size={32}
                  />

                </div>

                <h3 className="mt-4 text-lg font-bold">
                  Breakdown Reported
                </h3>

                <p className="mt-2 text-sm text-[#6B6B78]">
                  BUS-12 is unavailable for this route.
                </p>

                <div className="mt-5 rounded-xl bg-[#F0E9FF] p-5">

                  <p className="text-xs text-[#6B6B78]">
                    ALTERNATIVE BUS
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#6C3FC5]">
                    {alternativeBus}
                  </p>

                </div>

                <p className="mt-4 text-xs text-[#6B6B78]">
                  Students assigned to BUS-12 will see
                  {` ${alternativeBus} `}
                  as their alternative bus.
                </p>

              </div>

            )}

          </div>

        </div>

      )}

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white py-5 text-center text-xs text-[#6B6B78]">
        Smart Campus Transport Intelligence System
      </footer>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  green,
  yellow,
  red,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  green?: boolean;
  yellow?: boolean;
  red?: boolean;
}) {

  const iconClass = green
    ? "bg-green-50 text-green-600"
    : yellow
    ? "bg-yellow-50 text-yellow-600"
    : red
    ? "bg-red-50 text-red-600"
    : "bg-[#F0E9FF] text-[#6C3FC5]";

  return (

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>

      <p className="text-sm text-[#6B6B78]">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>

  );
}