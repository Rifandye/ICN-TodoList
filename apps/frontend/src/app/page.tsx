"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = false;

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Image
          className="dark:invert mx-auto mb-4"
          src="/next.svg"
          alt="Loading..."
          width={180}
          height={38}
          priority
        />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
