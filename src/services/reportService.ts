import { db } from '../config/firebase.js';

type ReportFilters = {
  shift?: string;
  busId?: string;
  driverId?: string;
  studentId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  severity?: string;
  category?: string;
};

async function fetchDocs<T = Record<string, any>>(queryOrRef: any): Promise<T[]> {
  try {
    const snapshot = await queryOrRef.get();
    const docs: T[] = [];

    if (snapshot.docs && Array.isArray(snapshot.docs)) {
      snapshot.docs.forEach((doc: any) => {
        docs.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    } else if (typeof snapshot.forEach === 'function') {
      snapshot.forEach((doc: any) => {
        docs.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    }

    return docs;
  } catch (error: any) {
    console.error('Error fetching collection docs:', error.message);
    return [];
  }
}

export async function getFleetPerformanceReport(filters: ReportFilters = {}) {
  const { shift, busId, driverId, startDate, endDate } = filters;

  const [buses, trips] = await Promise.all([
    fetchDocs<Record<string, any>>(db.collection('buses')),
    fetchDocs<Record<string, any>>(db.collection('trips'))
  ]);

  let filteredTrips = trips;

  if (shift) {
    filteredTrips = filteredTrips.filter(
      (t) => t.shift && t.shift.toUpperCase() === shift.toUpperCase()
    );
  }

  if (busId) {
    filteredTrips = filteredTrips.filter((t) => t.busId === busId);
  }

  if (driverId) {
    filteredTrips = filteredTrips.filter((t) => t.driverId === driverId);
  }

  if (startDate) {
    filteredTrips = filteredTrips.filter(
      (t) => t.startTime && t.startTime >= startDate
    );
  }

  if (endDate) {
    filteredTrips = filteredTrips.filter(
      (t) => t.startTime && t.startTime <= endDate
    );
  }

  const totalBuses = buses.length;
  const activeBuses = buses.filter(
    (b) => b.activeTripId !== null && b.activeTripId !== undefined
  ).length;
  const idleBuses = Math.max(0, totalBuses - activeBuses);

  const totalTrips = filteredTrips.length;
  const activeTrips = filteredTrips.filter((t) => t.status === 'ACTIVE').length;
  const completedTrips = filteredTrips.filter(
    (t) => t.status === 'COMPLETED'
  ).length;

  const shiftBreakdown: Record<string, number> = {};
  let totalDurationMinutes = 0;
  let tripsWithDuration = 0;

  filteredTrips.forEach((trip) => {
    if (trip.shift) {
      shiftBreakdown[trip.shift] = (shiftBreakdown[trip.shift] || 0) + 1;
    }

    if (trip.startTime && trip.endTime) {
      const start = new Date(trip.startTime).getTime();
      const end = new Date(trip.endTime).getTime();

      if (!isNaN(start) && !isNaN(end) && end > start) {
        const durationMinutes = (end - start) / (1000 * 60);
        totalDurationMinutes += durationMinutes;
        tripsWithDuration += 1;
      }
    }
  });

  const averageTripDurationMinutes =
    tripsWithDuration > 0
      ? Math.round((totalDurationMinutes / tripsWithDuration) * 10) / 10
      : 0;

  return {
    reportName: 'Fleet Performance & Punctuality Analytics',
    generatedAt: new Date().toISOString(),
    filtersApplied: filters,
    metrics: {
      totalBuses,
      activeBuses,
      idleBuses,
      fleetUtilizationRate:
        totalBuses > 0
          ? `${Math.round((activeBuses / totalBuses) * 100)}%`
          : '0%',
      totalTrips,
      activeTrips,
      completedTrips,
      averageTripDurationMinutes,
      shiftBreakdown
    }
  };
}

export async function getStudentAttendanceReport(filters: ReportFilters = {}) {
  const { busId, studentId, date, startDate, endDate } = filters;

  const [attendanceRecords, waitRequests] = await Promise.all([
    fetchDocs<Record<string, any>>(db.collection('attendance')),
    fetchDocs<Record<string, any>>(db.collection('waitRequests'))
  ]);

  let filteredAttendance = attendanceRecords;

  if (busId) {
    filteredAttendance = filteredAttendance.filter((a) => a.busId === busId);
  }
  if (studentId) {
    filteredAttendance = filteredAttendance.filter((a) => a.studentId === studentId);
  }
  if (date) {
    filteredAttendance = filteredAttendance.filter((a) => a.date === date);
  }
  if (startDate) {
    filteredAttendance = filteredAttendance.filter(
      (a) => a.date && a.date >= startDate
    );
  }
  if (endDate) {
    filteredAttendance = filteredAttendance.filter(
      (a) => a.date && a.date <= endDate
    );
  }

  let filteredWaitRequests = waitRequests;

  if (busId) {
    filteredWaitRequests = filteredWaitRequests.filter((w) => w.busId === busId);
  }
  if (studentId) {
    filteredWaitRequests = filteredWaitRequests.filter((w) => w.studentId === studentId);
  }

  const totalBoardings = filteredAttendance.length;
  const uniqueStudents = new Set(
    filteredAttendance.map((a) => a.studentId).filter(Boolean)
  );

  const boardingsByBus: Record<string, number> = {};
  const boardingsByDate: Record<string, number> = {};

  filteredAttendance.forEach((a) => {
    if (a.busId) {
      boardingsByBus[a.busId] = (boardingsByBus[a.busId] || 0) + 1;
    }
    if (a.date) {
      boardingsByDate[a.date] = (boardingsByDate[a.date] || 0) + 1;
    }
  });

  const totalWaitRequests = filteredWaitRequests.length;
  const waitRequestStatusBreakdown: Record<string, number> = {
    PENDING: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    FULFILLED: 0
  };

  filteredWaitRequests.forEach((w) => {
    if (w.status && waitRequestStatusBreakdown[w.status] !== undefined) {
      waitRequestStatusBreakdown[w.status] += 1;
    }
  });

  const fulfilledCount = waitRequestStatusBreakdown.FULFILLED || 0;
  const acceptedCount = (waitRequestStatusBreakdown.ACCEPTED || 0) + fulfilledCount;

  const fulfillmentRate =
    totalWaitRequests > 0
      ? `${Math.round((fulfilledCount / totalWaitRequests) * 100)}%`
      : '0%';

  const acceptanceRate =
    totalWaitRequests > 0
      ? `${Math.round((acceptedCount / totalWaitRequests) * 100)}%`
      : '0%';

  return {
    reportName: 'Student Attendance & Boarding Analytics',
    generatedAt: new Date().toISOString(),
    filtersApplied: filters,
    metrics: {
      totalBoardings,
      uniqueStudentsBoarded: uniqueStudents.size,
      boardingsByBus,
      boardingsByDate,
      totalWaitRequests,
      waitRequestStatusBreakdown,
      fulfillmentRate,
      acceptanceRate
    }
  };
}

export async function getBreakdownAnalyticsReport(filters: ReportFilters = {}) {
  const { busId, status, severity, startDate, endDate } = filters;

  const breakdowns = await fetchDocs<Record<string, any>>(db.collection('breakdowns'));

  let filtered = breakdowns;

  if (busId) {
    filtered = filtered.filter((b) => b.busId === busId);
  }
  if (status) {
    filtered = filtered.filter(
      (b) => b.status && b.status.toUpperCase() === status.toUpperCase()
    );
  }
  if (severity) {
    filtered = filtered.filter(
      (b) => b.severity && b.severity.toUpperCase() === severity.toUpperCase()
    );
  }
  if (startDate) {
    filtered = filtered.filter((b) => b.reportedAt && b.reportedAt >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((b) => b.reportedAt && b.reportedAt <= endDate);
  }

  const totalBreakdowns = filtered.length;
  const activeBreakdowns = filtered.filter((b) => b.status !== 'RESOLVED').length;
  const resolvedBreakdowns = filtered.filter((b) => b.status === 'RESOLVED').length;

  const statusBreakdown: Record<string, number> = {};
  const severityBreakdown: Record<string, number> = {};
  const reasonBreakdown: Record<string, number> = {};
  const breakdownsByBus: Record<string, number> = {};
  let totalDelay = 0;
  let delayCount = 0;

  filtered.forEach((b) => {
    if (b.status) {
      statusBreakdown[b.status] = (statusBreakdown[b.status] || 0) + 1;
    }
    if (b.severity) {
      severityBreakdown[b.severity] = (severityBreakdown[b.severity] || 0) + 1;
    }
    if (b.reason) {
      reasonBreakdown[b.reason] = (reasonBreakdown[b.reason] || 0) + 1;
    }
    if (b.busId) {
      breakdownsByBus[b.busId] = (breakdownsByBus[b.busId] || 0) + 1;
    }
    if (typeof b.estimatedDelayMinutes === 'number' && !isNaN(b.estimatedDelayMinutes)) {
      totalDelay += b.estimatedDelayMinutes;
      delayCount += 1;
    }
  });

  const averageEstimatedDelayMinutes =
    delayCount > 0
      ? Math.round((totalDelay / delayCount) * 10) / 10
      : 0;

  return {
    reportName: 'Breakdown & Maintenance Analytics',
    generatedAt: new Date().toISOString(),
    filtersApplied: filters,
    metrics: {
      totalBreakdowns,
      activeBreakdowns,
      resolvedBreakdowns,
      resolutionRate:
        totalBreakdowns > 0
          ? `${Math.round((resolvedBreakdowns / totalBreakdowns) * 100)}%`
          : '0%',
      averageEstimatedDelayMinutes,
      statusBreakdown,
      severityBreakdown,
      reasonBreakdown,
      breakdownsByBus
    }
  };
}

export async function getComplaintsAnalyticsReport(filters: ReportFilters = {}) {
  const { studentId, status, category, busId, startDate, endDate } = filters;

  const complaints = await fetchDocs<Record<string, any>>(db.collection('complaints'));

  let filtered = complaints;

  if (studentId) {
    filtered = filtered.filter((c) => c.studentId === studentId);
  }
  if (status) {
    filtered = filtered.filter(
      (c) => c.status && c.status.toUpperCase() === status.toUpperCase()
    );
  }
  if (category) {
    filtered = filtered.filter(
      (c) => c.category && c.category.toUpperCase() === category.toUpperCase()
    );
  }
  if (busId) {
    filtered = filtered.filter((c) => c.busId === busId);
  }
  if (startDate) {
    filtered = filtered.filter((c) => c.createdAt && c.createdAt >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((c) => c.createdAt && c.createdAt <= endDate);
  }

  const totalComplaints = filtered.length;
  const statusBreakdown: Record<string, number> = {
    SUBMITTED: 0,
    IN_REVIEW: 0,
    RESOLVED: 0
  };
  const categoryBreakdown: Record<string, number> = {};
  const complaintsByBus: Record<string, number> = {};

  filtered.forEach((c) => {
    if (c.status && statusBreakdown[c.status] !== undefined) {
      statusBreakdown[c.status] += 1;
    } else if (c.status) {
      statusBreakdown[c.status] = (statusBreakdown[c.status] || 0) + 1;
    }

    if (c.category) {
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    }
    if (c.busId) {
      complaintsByBus[c.busId] = (complaintsByBus[c.busId] || 0) + 1;
    }
  });

  const resolvedCount = statusBreakdown.RESOLVED || 0;
  const resolutionRate =
    totalComplaints > 0
      ? `${Math.round((resolvedCount / totalComplaints) * 100)}%`
      : '0%';

  return {
    reportName: 'Complaints & Student Satisfaction Analytics',
    generatedAt: new Date().toISOString(),
    filtersApplied: filters,
    metrics: {
      totalComplaints,
      resolvedComplaints: resolvedCount,
      pendingComplaints:
        (statusBreakdown.SUBMITTED || 0) + (statusBreakdown.IN_REVIEW || 0),
      resolutionRate,
      statusBreakdown,
      categoryBreakdown,
      complaintsByBus
    }
  };
}

export async function getExecutiveOverviewReport() {
  const [fleet, attendance, breakdowns, complaints] = await Promise.all([
    getFleetPerformanceReport(),
    getStudentAttendanceReport(),
    getBreakdownAnalyticsReport(),
    getComplaintsAnalyticsReport()
  ]);

  return {
    reportName: 'Smart Campus Transport Executive Intelligence Overview',
    generatedAt: new Date().toISOString(),
    metrics: {
      fleetSummary: {
        totalBuses: fleet.metrics.totalBuses,
        activeBuses: fleet.metrics.activeBuses,
        fleetUtilizationRate: fleet.metrics.fleetUtilizationRate,
        totalTrips: fleet.metrics.totalTrips,
        activeTrips: fleet.metrics.activeTrips
      },
      attendanceSummary: {
        totalBoardings: attendance.metrics.totalBoardings,
        uniqueStudentsBoarded: attendance.metrics.uniqueStudentsBoarded,
        totalWaitRequests: attendance.metrics.totalWaitRequests,
        waitRequestFulfillmentRate: attendance.metrics.fulfillmentRate
      },
      breakdownSummary: {
        totalBreakdowns: breakdowns.metrics.totalBreakdowns,
        activeBreakdowns: breakdowns.metrics.activeBreakdowns,
        breakdownResolutionRate: breakdowns.metrics.resolutionRate
      },
      complaintsSummary: {
        totalComplaints: complaints.metrics.totalComplaints,
        pendingComplaints: complaints.metrics.pendingComplaints,
        complaintResolutionRate: complaints.metrics.resolutionRate
      }
    }
  };
}
