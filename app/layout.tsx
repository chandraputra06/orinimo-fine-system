"use client";

import { useMemo, useState } from "react";

type PackageId = "1p1u_month" | "1p1u_week" | "1p2u";

interface PackageDef {
  id: PackageId;
  name: string;
  price: number;
  maxDevicesPerCustomer: number;
  maxCustomers?: number;
}

const PACKAGES: PackageDef[] = [
  {
    id: "1p1u_month",
    name: "1p1u - 1 Bulan (37.000)",
    price: 37000,
    maxDevicesPerCustomer: 1,
  },
  {
    id: "1p1u_week",
    name: "1p1u - 1 Minggu (12.000)",
    price: 12000,
    maxDevicesPerCustomer: 1,
  },
  {
    id: "1p2u",
    name: "1p2u - 10 Customer (23.000 / cust)",
    price: 23000,
    maxDevicesPerCustomer: 1,
    maxCustomers: 10,
  },
];

const PENALTY_RATE = 0.5; // 50% dari harga paket per device ekstra

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const [selectedPackageId, setSelectedPackageId] =
    useState<PackageId>("1p1u_month");
  const [deviceUsed, setDeviceUsed] = useState<number>(1);
  const [violatorCount, setViolatorCount] = useState<number>(1);

  const selectedPackage = useMemo(
    () => PACKAGES.find((p) => p.id === selectedPackageId)!,
    [selectedPackageId]
  );

  const calculation = useMemo(() => {
    const maxDevices = selectedPackage.maxDevicesPerCustomer;
    const price = selectedPackage.price;

    const extraDevices = Math.max(0, deviceUsed - maxDevices);
    const finePerExtraDevice = price * PENALTY_RATE;
    const totalFinePerCustomer = extraDevices * finePerExtraDevice;
    const totalFineAll = totalFinePerCustomer * violatorCount;

    return {
      maxDevices,
      extraDevices,
      finePerExtraDevice,
      totalFinePerCustomer,
      totalFineAll,
    };
  }, [deviceUsed, violatorCount, selectedPackage]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          Kalkulator Denda Multi Device Netflix
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mb-6 text-center">
          Hitung denda ketika customer login melebihi 1 device per customer.
        </p>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6 space-y-6">
          {/* Form Input */}
          <div className="space-y-4">
            {/* Paket */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">
                Pilih Paket
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) =>
                  setSelectedPackageId(e.target.value as PackageId)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                Harga per customer:{" "}
                <span className="font-semibold">
                  {formatCurrency(selectedPackage.price)}
                </span>{" "}
                • Batas: 1 device per customer.
              </p>
              {selectedPackage.maxCustomers && (
                <p className="text-xs text-slate-500">
                  Paket ini maksimal{" "}
                  <span className="font-semibold">
                    {selectedPackage.maxCustomers} customer
                  </span>
                  .
                </p>
              )}
            </div>

            {/* Jumlah Device Dipakai */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">
                Jumlah device 1 customer yang terdeteksi login
              </label>
              <input
                type="number"
                min={0}
                value={deviceUsed}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setDeviceUsed(Number.isNaN(v) ? 0 : v);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Misal: 2 jika login di HP + laptop"
              />
            </div>

            {/* Jumlah Pelanggar */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">
                Berapa customer yang melanggar?
              </label>
              <input
                type="number"
                min={1}
                value={violatorCount}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setViolatorCount(Number.isNaN(v) ? 1 : v);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Misal: 3"
              />
              <p className="text-xs text-slate-400">
                Contoh: kalau 3 orang ketahuan multi device, isi 3.
              </p>
            </div>
          </div>

          {/* Hasil Perhitungan */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Hasil Perhitungan
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Device ekstra per customer</p>
                <p className="text-lg font-semibold">
                  {calculation.extraDevices} perangkat
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Denda per device ekstra</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(calculation.finePerExtraDevice)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {Math.round(PENALTY_RATE * 100)}% × harga paket
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Denda per customer</p>
                <p className="text-lg font-semibold text-emerald-400">
                  {formatCurrency(calculation.totalFinePerCustomer)}
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">
                  Total denda untuk semua pelanggar
                </p>
                <p className="text-lg font-semibold text-emerald-400">
                  {formatCurrency(calculation.totalFineAll)}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Jika{" "}
              <span className="font-semibold">device ekstra = 0</span>, maka
              tidak ada denda.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-4 text-center">
          Ubah kebijakan denda dengan mengedit nilai{" "}
          <code className="bg-slate-900 px-1 py-0.5 rounded">PENALTY_RATE</code>{" "}
          di kode.
        </p>
      </div>
    </main>
  );
}
