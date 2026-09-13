interface ValidateQRInput {
    qrPayload: string;
    driverGps: {
        latitude: number;
        longitude: number;
    };
    driverId: string;
}
export declare const validateAndRecordAttendance: ({ qrPayload, driverGps, driverId }: ValidateQRInput) => Promise<{
    attendanceId: string;
    studentName: any;
    studentId: string | undefined;
    status: string;
}>;
export {};
//# sourceMappingURL=attendance.service.d.ts.map