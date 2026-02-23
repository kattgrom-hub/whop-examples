"use client";

import { useState } from "react";

interface Size {
  label: string;
  available: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
}

export default function SizeSelector({ sizes }: SizeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <h3 className="font-body font-semibold text-sockx-text text-sm mb-3">
        Select Size
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => (
          <button
            key={size.label}
            disabled={!size.available}
            onClick={() => setSelected(size.label)}
            className={`py-3 px-2 rounded-lg text-sm font-body font-semibold border transition-all duration-150 ${
              !size.available
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                : selected === size.label
                ? "bg-sockx-primary text-white border-sockx-primary shadow-md"
                : "bg-white text-sockx-text border-purple-200 hover:border-sockx-primary hover:bg-purple-50"
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
