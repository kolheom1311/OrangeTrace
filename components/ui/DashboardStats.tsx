"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust import path to your firebase config

interface Stats {
  totalSpent: number;
  avgPricePerKg: number;
  totalPurchases: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalSpent: 0,
    avgPricePerKg: 0,
    totalPurchases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        // Get orders for this user
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        let totalSpent = 0;
        let totalPricePerKg = 0;
        let totalPurchases = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Ensure numbers are valid
          const amount = Number(data.totalAmount) || 0;
          const pricePerKg = Number(data.pricePerKg) || 0;

          totalSpent += amount;
          totalPricePerKg += pricePerKg;
          totalPurchases += 1;
        });

        const avgPricePerKg =
          totalPurchases > 0 ? totalPricePerKg / totalPurchases : 0;

        setStats({
          totalSpent,
          avgPricePerKg,
          totalPurchases,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 shadow rounded bg-white">
        <h2 className="text-lg font-semibold">Total Spent</h2>
        <p>₹ {stats.totalSpent.toFixed(2)}</p>
      </div>
      <div className="p-4 shadow rounded bg-white">
        <h2 className="text-lg font-semibold">Avg Price/kg</h2>
        <p>₹ {stats.avgPricePerKg.toFixed(2)}</p>
      </div>
      <div className="p-4 shadow rounded bg-white">
        <h2 className="text-lg font-semibold">Total Purchases</h2>
        <p>{stats.totalPurchases}</p>
      </div>
    </div>
  );
}
