"use client";

import { useEffect, useState } from "react";

interface ContestCountdownProps {
  startTime: string;
}

export function ContestCountdown({ startTime }: ContestCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const diff = start - now;

      if (diff <= 0) {
        return "Started";
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    }

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime]);

  return <p className="text-xl font-semibold text-green-500">{timeLeft}</p>;
}
