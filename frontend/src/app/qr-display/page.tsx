"use client";

import { useEffect, useState } from "react";
import { Bus, ShieldCheck, Wifi, Clock3 } from "lucide-react";
import QRCode from "qrcode";

export default function QRDisplayPage() {
  const [qrCode, setQrCode] = useState("");
  const [countdown, setCountdown] = useState(20);

  const BUS_ID = "BUS-12";
  const ROUTE = "Ambattur → College";

  // Generate a new QR code
  const generateQR = async () => {
    const timestamp = Date.now();

    // DEMO PAYLOAD
    // Later this will come from your backend.
    const payload = JSON.stringify({
      busId: BUS_ID,
      token: `BUS12-${timestamp}`,
      timestamp,
    });

    try {
      const qr = await QRCode.toDataURL(payload, {
        width: 360,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      setQrCode(qr);
      setCountdown(20);
    } catch (error) {
      console.error("QR generation failed:", error);
    }
  };

  // Generate QR when page loads
  useEffect(() => {
    generateQR();
  }, []);

  // Countdown + QR refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          generateQR();
          return 20;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-[#E5E1EF] shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-[#6C3FC5] px-6 py-5 text-white">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Bus size={25} />
                </div>

                <div>
                  <p className="text-sm text-white/75">
                    Smart Campus Transport
                  </p>

                  <h1 className="text-xl font-semibold">
                    Bus Boarding
                  </h1>
                </div>
              </div>

              {/* Online indicator */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span className="text-xs font-medium">
                  Online
                </span>
              </div>

            </div>
          </div>

          {/* Bus Information */}
          <div className="px-6 pt-6">

            <div className="bg-[#F0E9FF] rounded-2xl p-4 flex items-center justify-between">

              <div>
                <p className="text-xs text-[#6B6B78] mb-1">
                  BUS NUMBER
                </p>

                <h2 className="text-2xl font-bold text-[#4B2A87]">
                  {BUS_ID}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#6B6B78] mb-1">
                  ROUTE
                </p>

                <p className="text-sm font-semibold text-[#1F1F29]">
                  {ROUTE}
                </p>
              </div>

            </div>

          </div>

          {/* Instruction */}
          <div className="text-center px-6 pt-7">

            <h2 className="text-xl font-semibold text-[#1F1F29]">
              Scan to Board
            </h2>

            <p className="text-sm text-[#6B6B78] mt-2">
              Open the Smart Campus Transport app
              and scan this QR code.
            </p>

          </div>

          {/* QR Code */}
          <div className="flex justify-center px-6 py-7">

            <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E1EF] shadow-sm">

              {qrCode ? (
                <img
                  src={qrCode}
                  alt="Bus boarding QR code"
                  className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
                />
              ) : (
                <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
                  <p className="text-sm text-[#6B6B78]">
                    Generating QR...
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Countdown */}
          <div className="px-6">

            <div className="flex items-center justify-center gap-2 text-[#6C3FC5]">

              <Clock3 size={18} />

              <span className="text-sm font-medium">
                New QR in
              </span>

              <span className="text-lg font-bold">
                {countdown}s
              </span>

            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-[#F0E9FF] rounded-full overflow-hidden">

              <div
                className="h-full bg-[#6C3FC5] transition-all duration-1000"
                style={{
                  width: `${(countdown / 20) * 100}%`,
                }}
              />

            </div>

          </div>

          {/* Security information */}
          <div className="px-6 py-6">

            <div className="bg-[#F8F7FC] border border-[#E5E1EF] rounded-xl p-4">

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#1F1F29]">
                    Secure Boarding
                  </p>

                  <p className="text-xs text-[#6B6B78] mt-1 leading-5">
                    This QR code changes automatically.
                    Only the current QR code can be used
                    for boarding verification.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E1EF] px-6 py-4">

            <div className="flex items-center justify-center gap-2 text-[#6B6B78]">

              <Wifi size={15} />

              <span className="text-xs">
                Connected to Transport System
              </span>

            </div>

          </div>

        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-[#6B6B78] mt-4">
          Please scan the QR code using your student app.
        </p>

      </div>
    </main>
  );
}