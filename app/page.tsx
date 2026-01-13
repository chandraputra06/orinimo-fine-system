"use client";

import { useState } from "react";

type AppId = "netflix"; // nanti bisa tambah misal: | "disney" | "prime"

interface AppDef {
  id: AppId;
  name: string;
  penaltyRate: number; // berapa % dari harga paket per device ekstra (1 = 100%)
}

type PackageId = "1p1u_month" | "1p1u_week" | "1p2u";

interface PackageDef {
  id: PackageId;
  appId: AppId;
  name: string;
  price: number;
  maxDevicesPerCustomer: number;
  maxCustomers?: number;
}

// Daftar aplikasi (sekarang cuma Netflix)
const APPS: AppDef[] = [
  {
    id: "netflix",
    name: "Netflix",
    penaltyRate: 1, // 100% dari harga paket per device ekstra
  },
  // Contoh nanti kalau mau nambah:
  // {
  //   id: "disney",
  //   name: "Disney+ Hotstar",
  //   penaltyRate: 0.5,
  // },
];

// Paket-paket, dikelompokkan per app lewat appId
const PACKAGES: PackageDef[] = [
  {
    id: "1p1u_month",
    appId: "netflix",
    name: "1p1u - 1 Bulan (37.000)",
    price: 37000,
    maxDevicesPerCustomer: 1,
  },
  {
    id: "1p1u_week",
    appId: "netflix",
    name: "1p1u - 1 Minggu (12.000)",
    price: 12000,
    maxDevicesPerCustomer: 1,
  },
  {
    id: "1p2u",
    appId: "netflix",
    name: "1p2u - 10 Customer (23.000 / cust)",
    price: 23000,
    maxDevicesPerCustomer: 1,
    maxCustomers: 10,
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const [selectedAppId, setSelectedAppId] = useState<AppId>("netflix");
  const [selectedPackageId, setSelectedPackageId] =
    useState<PackageId>("1p1u_month");
  const [deviceUsed, setDeviceUsed] = useState<number>(1);

  const selectedApp = APPS.find((a) => a.id === selectedAppId)!;
  const packageOptions = PACKAGES.filter((p) => p.appId === selectedAppId);
  const selectedPackage =
    packageOptions.find((p) => p.id === selectedPackageId) ||
    packageOptions[0];

  const maxDevices = selectedPackage.maxDevicesPerCustomer;
  const extraDevices = Math.max(0, deviceUsed - maxDevices);
  const finePerExtraDevice = selectedPackage.price * selectedApp.penaltyRate;
  const totalFine = extraDevices * finePerExtraDevice;
  const penaltyPercent = Math.round(selectedApp.penaltyRate * 100);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          Kalkulator Denda Multi Device
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mb-6 text-center">
          Hitung denda untuk{" "}
          <span className="font-semibold">1 customer</span> yang login
          melebihi batas device pada aplikasi streaming.
        </p>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6 space-y-6">
          {/* Form Input */}
          <div className="space-y-4">
            {/* Pilih Aplikasi */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">
                Pilih Aplikasi
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  const newAppId = e.target.value as AppId;
                  setSelectedAppId(newAppId);

                  // reset paket ke paket pertama di app tersebut
                  const firstPkg = PACKAGES.find(
                    (p) => p.appId === newAppId
                  );
                  if (firstPkg) {
                    setSelectedPackageId(firstPkg.id);
                  }
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {APPS.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                Denda per device ekstra aplikasi{" "}
                <span className="font-semibold">{selectedApp.name}</span>:{" "}
                <span className="font-semibold">{penaltyPercent}%</span> dari
                harga paket.
              </p>
            </div>

            {/* Paket */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">
                Pilih Paket ({selectedApp.name})
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) =>
                  setSelectedPackageId(e.target.value as PackageId)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {packageOptions.map((pkg) => (
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
                  , tapi kalkulator ini hanya menghitung denda untuk{" "}
                  <span className="font-semibold">1 customer</span>.
                </p>
              )}
            </div>

            {/* Jumlah Device Dipakai */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-200">
                Jumlah device customer ini yang terdeteksi login
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
              <p className="text-xs text-slate-400">
                Sistem ini hanya menghitung denda untuk{" "}
                <span className="font-semibold">1 customer</span>.
              </p>
            </div>
          </div>

          {/* Hasil Perhitungan */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Hasil Perhitungan (1 Customer)
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Batas device</p>
                <p className="text-lg font-semibold">
                  {maxDevices} perangkat
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Device ekstra</p>
                <p className="text-lg font-semibold">
                  {extraDevices} perangkat
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">
                  Denda per device ekstra ({selectedApp.name})
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(finePerExtraDevice)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {penaltyPercent}% × harga paket
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Total denda customer ini</p>
                <p className="text-lg font-semibold text-emerald-400">
                  {formatCurrency(totalFine)}
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
          Kamu bisa tambah aplikasi baru di array{" "}
          <code className="bg-slate-900 px-1 py-0.5 rounded">APPS</code> dan
          paketnya di{" "}
          <code className="bg-slate-900 px-1 py-0.5 rounded">PACKAGES</code>.
        </p>
      </div>
    </main>
  );
}