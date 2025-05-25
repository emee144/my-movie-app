"use client";
import { useEffect, useState } from "react";

export default function WithdrawalHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for error handling

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetching the withdrawal history without the need to retrieve the token manually
        const res = await fetch("/api/auth/withdrawal-history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ Ensure cookies are sent automatically with the request
        });

        if (!res.ok) {
          throw new Error("Failed to fetch withdrawal history");
        }

        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading withdrawal history...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>; // Display error message

  return (
    <div>
      <h2 className="text-xl font-bold color-blue-1500 mb-4">Withdrawal History</h2>
      {history.length === 0 ? (
        <p>No withdrawals yet.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Tax</th>
              <th className="py-2 px-4 border">Net</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="py-2 px-4 border">{entry.id}</td>
                <td className="py-2 px-4 border">{new Date(entry.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border">${entry.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border">${entry.tax.toFixed(2)}</td>
                <td className="py-2 px-4 border">${entry.net.toFixed(2)}</td>
                <td className="py-2 px-4 border">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}