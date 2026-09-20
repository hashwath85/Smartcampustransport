"use client";

import { useState } from "react";
import {
  Bus,
  MapPin,
  QrCode,
  Bell,
  User,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Send,
  X,
  Navigation,
  MessageSquareWarning,
} from "lucide-react";

type StudentStatus = "waiting" | "absent";

type ComplaintCategory =
  | "Cleanliness"
  | "Seat Availability"
  | "Speeding"
  | "Driver Behaviour"
  | "Bus Condition"
  | "Other";

export default function StudentDashboard() {
  const [studentStatus, setStudentStatus] =
    useState<StudentStatus>("waiting");

  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showQRInfo, setShowQRInfo] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const [complaintCategory, setComplaintCategory] =
    useState<ComplaintCategory>("Cleanliness");

  const [complaintText, setComplaintText] = useState("");

  const [showBreakdownAlert, setShowBreakdownAlert] = useState(true);

  const handleStatusChange = (status: StudentStatus) => {
    setStudentStatus(status);
  };

  const handleComplaintSubmit = () => {
    if (!complaintText.trim()) return;

    setComplaintSubmitted(true);
    setComplaintText("");

    setTimeout(() => {
      setComplaintSubmitted(false);
      setShowComplaintModal(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1F29]">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C3FC5] text-white">
              <Bus size={21} />
            </div>

            <div>
              <h1 className="text-base font-bold text-[#1F1F29]">
                Smart Campus Transport
              </h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100">
              <Bell size={20} />

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0E9FF] text-[#6C3FC5]">
                <User size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Dharshana K M</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* GREETING */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Hello, Dharshana K M 👋
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Here's your transport information for today.
          </p>
        </div>

        {/* BREAKDOWN ALERT */}
        {showBreakdownAlert && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={21} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-red-800">
                      Bus Breakdown Alert
                    </h3>

                    <p className="mt-1 text-sm text-red-700">
                      Your assigned bus{" "}
                      <span className="font-semibold">BUS-12</span>{" "}
                      has broken down.
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      This bus will not come to your route.
                    </p>

                    <div className="mt-3 rounded-xl border border-red-200 bg-white p-3">
                      <p className="text-xs font-medium text-gray-500">
                        Alternative Bus
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Bus size={17} className="text-[#6C3FC5]" />

                        <span className="font-bold text-[#6C3FC5]">
                          BUS-15
                        </span>

                        <span className="text-sm text-gray-500">
                          has been arranged
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBreakdownAlert(false)}
                    className="rounded-lg p-1 text-red-500 hover:bg-red-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNED BUS + BOARDING POINT */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* BUS CARD */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex flex-col justify-between gap-5 sm:flex-row">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Assigned Bus
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0E9FF] text-[#6C3FC5]">
                    <Bus size={25} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">BUS-12</h3>

                    <p className="text-sm text-gray-500">
                      Ambattur → College
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Running
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F8F7FC] p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={17} />

                  <span className="text-xs font-medium">
                    Boarding Point
                  </span>
                </div>

                <p className="mt-2 font-semibold">Ambattur OT</p>
              </div>

              <div className="rounded-xl bg-[#F8F7FC] p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock3 size={17} />

                  <span className="text-xs font-medium">
                    Expected Arrival
                  </span>
                </div>

                <p className="mt-2 font-semibold">7:55 AM</p>
              </div>
            </div>
          </div>

          {/* TODAY STATUS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={19}
                className="text-[#6C3FC5]"
              />

              <h3 className="font-bold">Today's Status</h3>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Let the driver know whether you are taking the bus.
            </p>

            <div className="mt-4 space-y-3">
              {/* WAITING */}
              <button
                onClick={() => handleStatusChange("waiting")}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  studentStatus === "waiting"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Waiting at Bus Stop
                    </p>

                    <p className="text-xs text-gray-500">
                      I am waiting for the bus
                    </p>
                  </div>
                </div>
              </button>

              {/* NOT COMING */}
              <button
                onClick={() => handleStatusChange("absent")}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  studentStatus === "absent"
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <X size={18} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Not Coming
                    </p>

                    <p className="text-xs text-gray-500">
                      I am not taking the bus today
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-[#F0E9FF] px-3 py-2">
              <p className="text-xs text-[#6C3FC5]">
                Current status:{" "}
                <span className="font-bold">
                  {studentStatus === "waiting"
                    ? "Waiting at Bus Stop"
                    : "Not Coming"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* LIVE BUS MAP + QR */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* MAP */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h3 className="font-bold">Live Bus Location</h3>

                <p className="mt-1 text-xs text-gray-500">
                  BUS-12 current location
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <Navigation size={14} />
                Live
              </div>
            </div>

            {/* DEMO MAP */}
            <div className="relative h-[330px] overflow-hidden bg-[#E9E7EF]">
              {/* ROAD-LIKE LINES */}
              <div className="absolute left-[8%] top-[48%] h-4 w-[85%] rotate-[-10deg] rounded-full bg-white" />
              <div className="absolute left-[20%] top-[15%] h-[80%] w-4 rotate-[22deg] rounded-full bg-white" />
              <div className="absolute left-[5%] top-[25%] h-3 w-[55%] rotate-[25deg] rounded-full bg-white" />
              <div className="absolute bottom-[18%] right-[5%] h-3 w-[55%] rotate-[-30deg] rounded-full bg-white" />

              {/* BUS MARKER */}
              <div className="absolute left-[53%] top-[45%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C3FC5] text-white shadow-lg ring-4 ring-white">
                  <Bus size={23} />
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold shadow-md">
                  BUS-12
                </div>
              </div>

              {/* BOARDING POINT */}
              <div className="absolute left-[27%] top-[57%] flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow ring-4 ring-white">
                  <MapPin size={16} />
                </div>

                <span className="mt-1 rounded bg-white px-2 py-1 text-[10px] font-semibold shadow">
                  Ambattur OT
                </span>
              </div>

              {/* COLLEGE */}
              <div className="absolute right-[12%] top-[24%] flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow ring-4 ring-white">
                  <MapPin size={16} />
                </div>

                <span className="mt-1 rounded bg-white px-2 py-1 text-[10px] font-semibold shadow">
                  College
                </span>
              </div>

              <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-2 text-xs shadow">
                <span className="font-semibold">
                  Route:
                </span>{" "}
                Ambattur → College
              </div>
            </div>
          </div>

          {/* QR CARD */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E9FF] text-[#6C3FC5]">
                <QrCode size={21} />
              </div>

              <div>
                <h3 className="font-bold">
                  Boarding Verification
                </h3>

                <p className="text-xs text-gray-500">
                  Scan the bus QR
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center rounded-2xl bg-[#F8F7FC] p-6 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-[#6C3FC5] bg-white">
                <QrCode
                  size={75}
                  strokeWidth={1.4}
                  className="text-[#6C3FC5]"
                />
              </div>

              <p className="mt-4 text-sm font-semibold">
                Scan Bus QR
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Scan the QR displayed inside the bus to verify
                boarding.
              </p>

              <button
                onClick={() => setShowQRInfo(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C3FC5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4B2A87]"
              >
                <QrCode size={17} />
                Scan Bus QR
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <Bell
                size={16}
                className="mt-0.5 shrink-0 text-blue-500"
              />

              <p className="text-xs leading-5 text-blue-700">
                Boarding will be marked automatically after
                successful QR verification.
              </p>
            </div>
          </div>
        </div>

        {/* COMPLAINT SECTION */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquareWarning
                  size={20}
                  className="text-[#6C3FC5]"
                />

                <h3 className="font-bold">
                  Report a Bus Complaint
                </h3>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Report issues related to your bus.
              </p>
            </div>

            <button
              onClick={() => setShowComplaintModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6C3FC5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4B2A87]"
            >
              <Send size={17} />
              Submit Complaint
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              [
                "Cleanliness",
                "Seat Availability",
                "Speeding",
                "Driver Behaviour",
                "Bus Condition",
                "Other",
              ] as ComplaintCategory[]
            ).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setComplaintCategory(category);
                  setShowComplaintModal(true);
                }}
                className="rounded-xl border border-gray-200 bg-[#F8F7FC] p-3 text-center text-xs font-medium text-gray-700 transition hover:border-[#6C3FC5] hover:bg-[#F0E9FF] hover:text-[#6C3FC5]"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={20} />
            </div>

            <h3 className="mt-4 font-bold">
              Boarding Status
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your boarding status is updated automatically
              after QR verification.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Navigation size={20} />
            </div>

            <h3 className="mt-4 font-bold">
              Live Tracking
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Track your assigned bus using the live GPS
              location.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <AlertTriangle size={20} />
            </div>

            <h3 className="mt-4 font-bold">
              Transport Alerts
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Receive important breakdown and route
              notifications.
            </p>
          </div>
        </div>
      </main>

      {/* QR INFO MODAL */}
      {showQRInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Scan Bus QR
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  QR scanning will use your phone camera.
                </p>
              </div>

              <button
                onClick={() => setShowQRInfo(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-[#F0E9FF] p-4">
              <div className="flex gap-3">
                <QrCode
                  size={20}
                  className="shrink-0 text-[#6C3FC5]"
                />

                <p className="text-sm leading-6 text-gray-700">
                  Scan the dynamic QR displayed on the bus.
                  Your location, bus assignment and QR token
                  will be verified before marking you as
                  boarded.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQRInfo(false)}
              className="mt-5 w-full rounded-xl bg-[#6C3FC5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4B2A87]"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Submit Complaint
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Report an issue with BUS-12.
                </p>
              </div>

              <button
                onClick={() => setShowComplaintModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {complaintSubmitted ? (
              <div className="mt-8 flex flex-col items-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={32} />
                </div>

                <h4 className="mt-4 text-lg font-bold">
                  Complaint Submitted
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  Your complaint has been recorded successfully.
                </p>
              </div>
            ) : (
              <>
                {/* CATEGORY */}
                <div className="mt-5">
                  <label className="text-sm font-semibold">
                    Complaint Category
                  </label>

                  <select
                    value={complaintCategory}
                    onChange={(e) =>
                      setComplaintCategory(
                        e.target.value as ComplaintCategory
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6C3FC5] focus:ring-2 focus:ring-[#F0E9FF]"
                  >
                    <option>Cleanliness</option>
                    <option>Seat Availability</option>
                    <option>Speeding</option>
                    <option>Driver Behaviour</option>
                    <option>Bus Condition</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-4">
                  <label className="text-sm font-semibold">
                    Description
                  </label>

                  <textarea
                    value={complaintText}
                    onChange={(e) =>
                      setComplaintText(e.target.value)
                    }
                    placeholder="Describe the issue..."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6C3FC5] focus:ring-2 focus:ring-[#F0E9FF]"
                  />
                </div>

                <button
                  onClick={handleComplaintSubmit}
                  disabled={!complaintText.trim()}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C3FC5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4B2A87] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={17} />
                  Submit Complaint
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}