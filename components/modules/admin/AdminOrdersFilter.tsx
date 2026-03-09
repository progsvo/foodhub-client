"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PLACED", label: "Placed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY", label: "Ready" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function AdminOrdersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <Select value={currentStatus} onChange={handleChange} className="w-[180px]">
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value || "all"} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
