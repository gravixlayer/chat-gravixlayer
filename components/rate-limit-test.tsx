"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function RateLimitTest() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initialize count from localStorage
    if (typeof window !== "undefined") {
      const storedCount = Number.parseInt(
        localStorage.getItem("guest_query_count") || "0",
        10
      );
      setCount(storedCount);
    }
  }, []);

  const handleIncrement = () => {
    if (typeof window !== "undefined") {
      const newCount = count + 1;
      setCount(newCount);
      localStorage.setItem("guest_query_count", newCount.toString());
      window.dispatchEvent(new Event("queryCountUpdate"));
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      setCount(0);
      localStorage.removeItem("guest_query_count");
      window.dispatchEvent(new Event("queryCountUpdate"));
    }
  };

  const handleSet7 = () => {
    if (typeof window !== "undefined") {
      setCount(7);
      localStorage.setItem("guest_query_count", "7");
      window.dispatchEvent(new Event("queryCountUpdate"));
    }
  };

  return (
    <div className="px-2 py-2">
      <div className="flex flex-wrap gap-1">
        <Button
          className="h-6 px-2 text-xs"
          onClick={handleIncrement}
          size="sm"
          variant="outline"
        >
          +1 ({count})
        </Button>
        <Button
          className="h-6 px-2 text-xs"
          onClick={handleSet7}
          size="sm"
          variant="outline"
        >
          Set 7
        </Button>
        <Button
          className="h-6 px-2 text-xs"
          onClick={handleReset}
          size="sm"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
