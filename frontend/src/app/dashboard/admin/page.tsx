"use client";

import { useMemo, useState } from "react";
import {
  Bus,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MessageSquare,
  ShieldAlert,
  Users,
  X,
  Search,
  PieChart,
} from "lucide-react";

type BusStatus = "running" | "delayed" | "breakdown";

type ComplaintType =
  | "Cleanliness"
  | "Seat Availability"
  | "Speeding"
  | "Driver Behaviour"
  | "Bus Condition"
  | "Other";

type Complaint = {
  id: number;
  busId: string;
  student: string;
  studentId: string;
  type: ComplaintType;
  description: string;
  date: string;
  status: "Pending" | "Reviewed" | "Resolved";
};

type BusInfo = {
  id: string;
  route: string;
  status: BusStatus;
  latitude: number;
  longitude: number;
  driver: string;
  students: number;
  boarded: number;
  waiting: number;
  notComing: number;
  tripStarted: string;
  tripEnded: string;
  alternativeBus?: string;
  breakdownReason?: string;
};

const buses: BusInfo[] = [
  {
    id: "BUS-12",
    route: "Ambattur → College",
    status: "running",
    latitude: 13.1142,
    longitude: 80.1548,
    driver: "Ravi Kumar",
    students: 42,
    boarded: 34,
    waiting: 6,
    notComing: 2,
    tripStarted: "07:42 AM",
    tripEnded: "-",
  },
  {
    id: "BUS-15",
    route: "Padi → College",
    status: "running",
    latitude: 13.0987,
    longitude: 80.1842,
    driver: "Suresh Kumar",
    students: 38,
    boarded: 31,
    waiting: 5,
    notComing: 2,
    tripStarted: "07:38 AM",
    tripEnded: "-",
  },
  {
    id: "BUS-21",
    route: "Anna Nagar → College",
    status: "breakdown",
    latitude: 13.0878,
    longitude: 80.2084,
    driver: "Arun Kumar",
    students: 40,
    boarded: 0,
    waiting: 28,
    notComing: 4,
    tripStarted: "07:35 AM",
    tripEnded: "08:26 AM",
    alternativeBus: "BUS-15",
    breakdownReason: "Engine problem",
  },
  {
    id: "BUS-25",
    route: "Mogappair → College",
    status: "delayed",
    latitude: 13.0821,
    longitude: 80.1683,
    driver: "Karthik",
    students: 35,
    boarded: 25,
    waiting: 8,
    notComing: 2,
    tripStarted: "07:50 AM",
    tripEnded: "-",
  },
];

const complaints: Complaint[] = [
  {
    id: 1,
    busId: "BUS-12",
    student: "Dharshana K M",
    studentId: "CYB066",
    type: "Cleanliness",
    description: "Seats need cleaning.",
    date: "14 Sep 2026",
    status: "Pending",
  },
  {
    id: 2,
    busId: "BUS-12",
    student: "Arun Kumar",
    studentId: "CYB021",
    type: "Speeding",
    description: "Bus was travelling at high speed near Padi.",
    date: "14 Sep 2026",
    status: "Reviewed",
  },
  {
    id: 3,
    busId: "BUS-12",
    student: "Priya S",
    studentId: "CYB044",
    type: "Seat Availability",
    description: "Not enough seats during morning trip.",
    date: "13 Sep 2026",
    status: "Pending",
  },
  {
    id: 4,
    busId: "BUS-12",
    student: "Rahul M",
    studentId: "CYB052",
    type: "Driver Behaviour",
    description: "Driver did not wait long enough at the stop.",
    date: "13 Sep 2026",
    status: "Resolved",
  },
  {
    id: 5,
    busId: "BUS-12",
    student: "Nandhini R",
    studentId: "CYB031",
    type: "Bus Condition",
    description: "One window is damaged.",
    date: "12 Sep 2026",
    status: "Pending",
  },
  {
    id: 6,
    busId: "BUS-15",
    student: "Kaviya",
    studentId: "CYB071",
    type: "Cleanliness",
    description: "Floor needs cleaning.",
    date: "14 Sep 2026",
    status: "Pending",
  },
  {
    id: 7,
    busId: "BUS-15",
    student: "Vishnu",
    studentId: "CYB082",
    type: "Speeding",
    description: "Speed was high near the signal.",
    date: "13 Sep 2026",
    status: "Reviewed",
  },
  {
    id: 8,
    busId: "BUS-21",
    student: "Meena",
    studentId: "CYB091",
    type: "Bus Condition",
    description: "Bus made unusual engine noise.",
    date: "14 Sep 2026",
    status: "Reviewed",
  },
  {
    id: 9,
    busId: "BUS-21",
    student: "Ajay",
    studentId: "CYB035",
    type: "Seat Availability",
    description: "Seats were insufficient.",
    date: "13 Sep 2026",
    status: "Pending",
  },
];

const complaintTypes: ComplaintType[] = [
  "Cleanliness",
  "Seat Availability",
  "Speeding",
  "Driver Behaviour",
  "Bus Condition",
  "Other",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "complaints" | "alerts"
  >("overview");

  const [selectedBusId, setSelectedBusId] = useState("BUS-12");

  const [search, setSearch] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const selectedBus = buses.find((bus) => bus.id === selectedBusId)!;

  /*
   * Complaints belonging ONLY to selected bus
   */
  const busComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesBus = complaint.busId === selectedBusId;

      const matchesSearch =
        complaint.student.toLowerCase().includes(search.toLowerCase()) ||
        complaint.type.toLowerCase().includes(search.toLowerCase()) ||
        complaint.description.toLowerCase().includes(search.toLowerCase());

      return matchesBus && matchesSearch;
    });
  }, [selectedBusId, search]);

  /*
   * Complaint counts for selected bus
   */
  const complaintStats = useMemo(() => {
    return complaintTypes.map((type) => ({
      type,
      count: complaints.filter(
        (complaint) =>
          complaint.busId === selectedBusId && complaint.type === type
      ).length,
    }));
  }, [selectedBusId]);

  const totalBusComplaints = busComplaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.busId === selectedBusId && c.status === "Pending"
  ).length;

  const reviewedComplaints = complaints.filter(
    (c) => c.busId === selectedBusId && c.status === "Reviewed"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.busId === selectedBusId && c.status === "Resolved"
  ).length;

  /*
   * Pie chart percentages
   */
  const pieSegments = useMemo(() => {
    const total = complaintStats.reduce(
      (sum, item) => sum + item.count,
      0
    );

    if (total === 0) return [];

    let currentAngle = 0;

    return complaintStats
      .filter((item) => item.count > 0)
      .map((item) => {
        const percentage = (item.count / total) * 100;

        const start = currentAngle;

        currentAngle += percentage;

        return {
          ...item,
          percentage,
          start,
          end: currentAngle,
        };
      });
  }, [complaintStats]);

  /*
   * CSS conic-gradient pie chart
   */
  const pieGradient =
    pieSegments.length > 0
      ? `conic-gradient(
          #6C3FC5 0% 40%,
          #3B82F6 40% 60%,
          #F59E0B 60% 80%,
          #EF4444 80% 100%
        )`
      : "#E5E7EB";

  const getStatusStyle = (status: BusStatus) => {
    if (status === "running") {
      return {
        bg: "#ECFDF3",
        text: "#15803D",
        label: "Running",
      };
    }

    if (status === "delayed") {
      return {
        bg: "#FFF7ED",
        text: "#C2410C",
        label: "Delayed",
      };
    }

    return {
      bg: "#FEF2F2",
      text: "#DC2626",
      label: "Breakdown",
    };
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1F29]">
      {/* NAVBAR */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-[#4B2A87]">
              Smart Campus Transport
            </h1>
            <p className="text-xs text-gray-500">Admin Command Dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E9FF]">
              <ShieldAlert size={20} className="text-[#6C3FC5]" />
            </div>

            <div>
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-gray-500">Transport Control</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-7">
        {/* TITLE */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Transport Overview</h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor buses, complaints, trips and safety incidents.
          </p>
        </div>

        {/* TABS */}
        <div className="mb-6 flex gap-2 rounded-xl bg-white p-2 shadow-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${
              activeTab === "overview"
                ? "bg-[#6C3FC5] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Fleet Overview
          </button>

          <button
            onClick={() => setActiveTab("complaints")}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${
              activeTab === "complaints"
                ? "bg-[#6C3FC5] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Complaints
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${
              activeTab === "alerts"
                ? "bg-[#6C3FC5] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Safety Alerts
          </button>
        </div>

        {/* ========================= */}
        {/* FLEET OVERVIEW */}
        {/* ========================= */}

        {activeTab === "overview" && (
          <>
            {/* BUS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {buses.map((bus) => {
                const status = getStatusStyle(bus.status);

                return (
                  <button
                    key={bus.id}
                    onClick={() => setSelectedBusId(bus.id)}
                    className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md ${
                      selectedBusId === bus.id
                        ? "border-[#6C3FC5] ring-2 ring-[#F0E9FF]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0E9FF]">
                          <Bus size={22} className="text-[#6C3FC5]" />
                        </div>

                        <div>
                          <p className="font-bold">{bus.id}</p>
                          <p className="text-xs text-gray-500">
                            {bus.route}
                          </p>
                        </div>
                      </div>

                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: status.bg,
                          color: status.text,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {bus.status === "breakdown" && (
                      <div className="mb-3 rounded-lg bg-red-50 p-3">
                        <p className="text-xs font-bold text-red-700">
                          ⚠ Breakdown
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                          {bus.breakdownReason}
                        </p>

                        {bus.alternativeBus && (
                          <p className="mt-1 text-xs font-semibold text-green-700">
                            Alternative: {bus.alternativeBus}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-gray-50 p-2">
                        <p className="text-lg font-bold">
                          {bus.boarded}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Boarded
                        </p>
                      </div>

                      <div className="rounded-lg bg-yellow-50 p-2">
                        <p className="text-lg font-bold text-yellow-700">
                          {bus.waiting}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Waiting
                        </p>
                      </div>

                      <div className="rounded-lg bg-red-50 p-2">
                        <p className="text-lg font-bold text-red-600">
                          {bus.notComing}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Absent
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SELECTED BUS */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* MAP */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">
                      {selectedBus.id} Live GPS
                    </h3>

                    <p className="text-xs text-gray-500">
                      {selectedBus.route}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    GPS Online
                  </span>
                </div>

                <div className="relative h-[340px] overflow-hidden rounded-xl bg-[#EDEAF5]">
                  {/* Fake map roads */}
                  <div className="absolute left-[20%] top-0 h-full w-3 rotate-[25deg] bg-white" />
                  <div className="absolute left-[55%] top-0 h-full w-4 rotate-[-18deg] bg-white" />
                  <div className="absolute left-0 top-[55%] h-4 w-full rotate-[8deg] bg-white" />

                  {/* BUS MARKER */}
                  <div className="absolute left-[48%] top-[42%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C3FC5] shadow-lg">
                      <Bus size={23} className="text-white" />
                    </div>

                    <div className="mt-2 rounded-lg bg-white px-3 py-2 text-center shadow">
                      <p className="text-xs font-bold">
                        {selectedBus.id}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Live location
                      </p>
                    </div>
                  </div>

                  {/* STOP */}
                  <div className="absolute bottom-[20%] left-[25%]">
                    <MapPin size={28} className="text-red-500" />

                    <span className="ml-[-20px] rounded bg-white px-2 py-1 text-[10px] shadow">
                      Boarding Stop
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-500">
                      Latitude
                    </p>
                    <p className="font-semibold">
                      {selectedBus.latitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Longitude
                    </p>
                    <p className="font-semibold">
                      {selectedBus.longitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Driver
                    </p>
                    <p className="font-semibold">
                      {selectedBus.driver}
                    </p>
                  </div>
                </div>
              </div>

              {/* TRIP DETAILS */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-5 font-bold">
                  Trip Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#F0E9FF] p-2">
                      <Clock3
                        size={18}
                        className="text-[#6C3FC5]"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Trip Started
                      </p>
                      <p className="font-semibold">
                        {selectedBus.tripStarted}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Clock3 size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Trip Ended
                      </p>
                      <p className="font-semibold">
                        {selectedBus.tripEnded}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Total Students
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {selectedBus.students}
                    </p>
                  </div>

                  {selectedBus.status === "breakdown" && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <div className="flex gap-3">
                        <AlertTriangle
                          size={20}
                          className="text-red-600"
                        />

                        <div>
                          <p className="font-bold text-red-700">
                            Bus Breakdown
                          </p>

                          <p className="mt-1 text-xs text-red-600">
                            {selectedBus.id} is unavailable.
                          </p>

                          <p className="mt-2 text-sm font-bold text-green-700">
                            🚌 Alternative Bus:{" "}
                            {selectedBus.alternativeBus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* COMPLAINTS */}
        {/* ========================= */}

        {activeTab === "complaints" && (
          <>
            {/* BUS SELECTOR */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">
                    Bus Complaint Analysis
                  </h3>

                  <p className="text-xs text-gray-500">
                    Select a bus to view its complete complaint history.
                  </p>
                </div>

                <MessageSquare
                  size={22}
                  className="text-[#6C3FC5]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {buses.map((bus) => (
                  <button
                    key={bus.id}
                    onClick={() => {
                      setSelectedBusId(bus.id);
                      setSearch("");
                    }}
                    className={`rounded-lg px-5 py-3 text-sm font-semibold ${
                      selectedBusId === bus.id
                        ? "bg-[#6C3FC5] text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {bus.id}
                  </button>
                ))}
              </div>
            </div>

            {/* SELECTED BUS HEADER */}
            <div className="mb-6 rounded-2xl bg-[#4B2A87] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-200">
                    Selected Bus
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {selectedBus.id}
                  </h2>

                  <p className="mt-1 text-sm text-purple-200">
                    {selectedBus.route}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <MessageSquare size={28} />
                </div>
              </div>
            </div>

            {/* COMPLAINT SUMMARY CARDS */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-500">
                  Total Complaints
                </p>

                <p className="mt-2 text-3xl font-bold text-[#6C3FC5]">
                  {totalBusComplaints}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <p className="text-xs text-yellow-700">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-700">
                  {pendingComplaints}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs text-blue-700">
                  Reviewed
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-700">
                  {reviewedComplaints}
                </p>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <p className="text-xs text-green-700">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-700">
                  {resolvedComplaints}
                </p>
              </div>
            </div>

            {/* PIE + BREAKDOWN */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              {/* PIE CHART */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-[#F0E9FF] p-2">
                    <PieChart
                      size={20}
                      className="text-[#6C3FC5]"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Overall Complaints
                    </h3>

                    <p className="text-xs text-gray-500">
                      Complaint distribution for {selectedBus.id}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-7 md:flex-row">
                  {/* PIE */}
                  <div
                    className="relative h-52 w-52 rounded-full"
                    style={{
                      background: pieGradient,
                    }}
                  >
                    <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {totalBusComplaints}
                        </p>

                        <p className="text-[11px] text-gray-500">
                          Total
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LEGEND */}
                  <div className="space-y-3">
                    {complaintStats.map((item, index) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between gap-8"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              background:
                                [
                                  "#6C3FC5",
                                  "#3B82F6",
                                  "#F59E0B",
                                  "#EF4444",
                                  "#10B981",
                                  "#8B5CF6",
                                ][index],
                            }}
                          />

                          <span className="text-sm">
                            {item.type}
                          </span>
                        </div>

                        <span className="font-bold">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CATEGORY BREAKDOWN */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 font-bold">
                  {selectedBus.id} Complaint Breakdown
                </h3>

                <div className="space-y-4">
                  {complaintStats.map((item) => {
                    const percentage =
                      totalBusComplaints === 0
                        ? 0
                        : (item.count / totalBusComplaints) * 100;

                    return (
                      <div key={item.type}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>{item.type}</span>

                          <span className="font-bold">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#6C3FC5]"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* INDIVIDUAL COMPLAINTS */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-bold">
                    Individual Complaints — {selectedBus.id}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Every complaint submitted for this particular bus.
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search complaints..."
                    className="rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#6C3FC5]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Student
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Complaint Type
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Description
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {busComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="border-t border-gray-100"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-sm">
                            {complaint.student}
                          </p>

                          <p className="text-xs text-gray-500">
                            {complaint.studentId}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#F0E9FF] px-3 py-1 text-xs font-semibold text-[#6C3FC5]">
                            {complaint.type}
                          </span>
                        </td>

                        <td className="max-w-[280px] px-5 py-4 text-sm text-gray-600">
                          {complaint.description}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {complaint.date}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              complaint.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : complaint.status === "Reviewed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              setSelectedComplaint(complaint)
                            }
                            className="rounded-lg bg-[#F0E9FF] px-3 py-2 text-xs font-semibold text-[#6C3FC5] hover:bg-[#E7DBFF]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {busComplaints.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm text-gray-500"
                        >
                          No complaints found for {selectedBus.id}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* SAFETY ALERTS */}
        {/* ========================= */}

        {activeTab === "alerts" && (
          <>
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex gap-4">
                <div className="rounded-xl bg-red-100 p-3">
                  <AlertTriangle
                    size={24}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-red-700">
                    Active Transport Alerts
                  </h3>

                  <p className="mt-1 text-sm text-red-600">
                    Important incidents requiring admin attention.
                  </p>
                </div>
              </div>
            </div>

            {/* BREAKDOWN ALERT */}
            {buses
              .filter((bus) => bus.status === "breakdown")
              .map((bus) => (
                <div
                  key={bus.id}
                  className="mb-4 rounded-2xl border border-red-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                        <Bus
                          size={24}
                          className="text-red-600"
                        />
                      </div>

                      <div>
                        <p className="text-lg font-bold">
                          {bus.id} — Bus Breakdown
                        </p>

                        <p className="text-sm text-gray-500">
                          {bus.route}
                        </p>

                        <p className="mt-2 text-sm text-red-600">
                          Reason: {bus.breakdownReason}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <p className="text-xs text-green-700">
                        Alternative bus arranged
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-700">
                        🚌 {bus.alternativeBus}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Trip Started
                      </p>

                      <p className="mt-1 font-bold">
                        {bus.tripStarted}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Breakdown / Trip Ended
                      </p>

                      <p className="mt-1 font-bold">
                        {bus.tripEnded}
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="text-xs text-green-700">
                        Replacement Bus
                      </p>

                      <p className="mt-1 font-bold text-green-700">
                        {bus.alternativeBus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {/* MISSED STUDENT */}
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex gap-4">
                <Clock3
                  size={24}
                  className="text-yellow-700"
                />

                <div>
                  <h3 className="font-bold text-yellow-800">
                    Missed Student Alert
                  </h3>

                  <p className="mt-2 text-sm text-yellow-700">
                    Student was marked as waiting at the boarding
                    point, but the bus passed without boarding
                    verification.
                  </p>

                  <div className="mt-4 rounded-xl bg-white p-4">
                    <p className="font-semibold">
                      Rahul M — CYB052
                    </p>

                    <p className="text-sm text-gray-500">
                      Bus: BUS-12 · Stop: Mogappair
                    </p>

                    <p className="mt-2 text-xs text-red-600">
                      ⚠ Student waiting but not verified as boarded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* COMPLAINT DETAILS MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="font-bold">
                  Complaint Details
                </h3>

                <p className="text-xs text-gray-500">
                  {selectedComplaint.busId}
                </p>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs text-gray-500">
                  Student
                </p>

                <p className="font-semibold">
                  {selectedComplaint.student}
                </p>

                <p className="text-xs text-gray-500">
                  {selectedComplaint.studentId}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Complaint Type
                </p>

                <p className="mt-1 font-semibold text-[#6C3FC5]">
                  {selectedComplaint.type}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Description
                </p>

                <div className="mt-2 rounded-xl bg-gray-50 p-4 text-sm">
                  {selectedComplaint.description}
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="text-sm font-semibold">
                    {selectedComplaint.date}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p className="text-sm font-semibold">
                    {selectedComplaint.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t p-5">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-full rounded-lg bg-[#6C3FC5] py-3 text-sm font-semibold text-white hover:bg-[#5B32AB]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-5 text-center text-xs text-gray-500">
        Smart Campus Transport Intelligence System
      </footer>
    </div>
  );
}