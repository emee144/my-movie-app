"use client";
import { useState, useEffect } from "react";
import WithdrawalSection from "@/components/WithdrawalSection";
import WithdrawButton from "@/components/WithdrawButton";

const fetchSavedBankDetails = async () => {
  const res = await fetch("/api/auth/withdrawal-settings", {
    method: "GET",
    credentials: "include", // Important for sending cookies
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user bank details");
  }

  const user = await res.json();
  return {
    accountName: user.accountName,
    bankName: user.bankName,
    accountNumber: user.accountNumber,
  };
};

// Fetch withdrawal history
const fetchWithdrawalHistory = async () => {
  const res = await fetch("/api/auth/withdrawal-history", {
    method: "GET",
    credentials: "include", // Make sure cookies are sent
  });

  if (!res.ok) {
    throw new Error("Failed to fetch withdrawal history");
  }

  return await res.json();
};

export default function WithdrawPage() {
  const [withdrawal, setWithdrawal] = useState({
    accountName: "",
    bankName: "",
    accountNumber: ""
  });
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved bank details and withdrawal history
  useEffect(() => {
    const loadSavedBankDetails = async () => {
      try {
        const savedDetails = await fetchSavedBankDetails();
        setWithdrawal(savedDetails);
      } catch (error) {
        console.error("Failed to load bank details:", error);
      }
    };

    const loadWithdrawalHistory = async () => {
      try {
        const history = await fetchWithdrawalHistory();
        setWithdrawalHistory(history);
      } catch (error) {
        console.error("Failed to load withdrawal history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedBankDetails();
    loadWithdrawalHistory();
  }, []); // Empty array means this runs once when the component mounts

  const handleNewWithdrawal = async (amount) => {
    try {
      // Calculate tax and net amount
      const numAmount = parseFloat(amount);
      const tax = numAmount * 0.05; // 5% tax
      const net = numAmount - tax;

      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          tax: tax,
          net: net
        }),
        credentials: "include", // Send cookies with the request
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Withdrawal successful", data);
        // Refresh withdrawal history after successful withdrawal
        const history = await fetchWithdrawalHistory();
        setWithdrawalHistory(history);
      } else {
        console.error("Failed to withdraw:", data.error);
      }
    } catch (error) {
      console.error("Error posting withdrawal:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-r from-blue-50 to-teal-50">
      <h1 className="text-2xl font-bold mb-6 bg-blue-500 text-white p-4 rounded">Withdraw Funds</h1>

      {/* Conditionally render a message if no bank details are available */}
      {!withdrawal.accountName || !withdrawal.bankName || !withdrawal.accountNumber ? (
        <div className="text-red-500 mb-4">
          No bank details available. Please add your bank details.
        </div>
      ) : null}

      {/* Render the WithdrawalSection component and pass withdrawal and setWithdrawal */}
      <WithdrawalSection withdrawal={withdrawal} setWithdrawal={setWithdrawal} />

      {/* Display withdrawal history */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Withdrawal History</h2>
        {loading ? (
          <p>Loading withdrawal history...</p>
        ) : withdrawalHistory.length === 0 ? (
          <p>No withdrawals made yet.</p>
        ) : (
          <ul className="space-y-3">
            {withdrawalHistory.map((w) => (
              <li key={w.id} className="border p-3 rounded">
                <p>💰 Amount: {w.amount}</p>
                <p>🧾 Tax: {w.tax}</p>
                <p>💸 Net: {w.net}</p>
                <p>📆 Date: {new Date(w.createdAt).toLocaleString()}</p>
                <p>📌 Status: {w.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add a withdrawal button */}
      <WithdrawButton onWithdraw={handleNewWithdrawal} />
    </div>
  );
}
