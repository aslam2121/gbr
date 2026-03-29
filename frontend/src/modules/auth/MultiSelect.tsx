"use client";

import { useState } from "react";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: boolean;
}

export function MultiSelect({ options, value, onChange, placeholder, error }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (val: string) => {
    onChange(
      value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val]
    );
  };

  const remove = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[38px] rounded-lg border px-3 py-2 text-sm cursor-pointer flex flex-wrap gap-1 items-center ${
          error
            ? "border-red-300"
            : "border-gray-300 focus-within:border-blue-500"
        }`}
      >
        {value.length === 0 && (
          <span className="text-gray-400">{placeholder || "Select..."}</span>
        )}
        {value.map((val) => {
          const opt = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
            >
              {opt?.label || val}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(val);
                }}
                className="text-blue-400 hover:text-blue-600"
              >
                x
              </button>
            </span>
          );
        })}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                value.includes(opt.value) ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
