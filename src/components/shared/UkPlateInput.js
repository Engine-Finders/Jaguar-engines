"use client";

import { useState } from "react";

export default function UkPlateInput({
  value: controlledValue,
  onChange,
  placeholder = "REG HERE",
  className = "",
}) {
  const [internal, setInternal] = useState("");
  const value = controlledValue ?? internal;

  function handleChange(e) {
    const next = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    if (onChange) onChange(next);
    else setInternal(next);
  }

  return (
    <div
      className={`flex min-h-[3.25rem] min-w-0 overflow-hidden rounded-md border border-[#1a1a1a] bg-[#F7CE45] shadow-sm sm:min-h-14 ${className}`}
    >
      {/* Blue GB strip */}
      <div className="flex w-10 shrink-0 flex-col items-center justify-center bg-[#1B3E8A] text-white sm:w-11">
        <span className="text-[0.68rem] font-bold leading-none tracking-wide sm:text-[0.72rem]">
          GB
        </span>
      </div>

      {/* Yellow plate input */}
      <input
        type="text"
        value={value}
        maxLength={8}
        autoComplete="off"
        placeholder={placeholder}
        onChange={handleChange}
        aria-label="Vehicle registration"
        className="w-full bg-transparent px-3 text-center text-lg font-bold tracking-[0.12em] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/55 sm:text-xl"
      />
    </div>
  );
}
