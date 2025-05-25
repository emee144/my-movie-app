"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const WithdrawButton = ({ onWithdraw }) => {
  const router = useRouter();
  const [amount, setAmount] = useState(''); // Default amount with state

  const handleWithdraw = async () => {
    if (typeof onWithdraw === 'function') {
      // Use the callback from parent component if provided
      await onWithdraw(amount);
    } else {
      // Fallback to direct API call if no callback provided
      const tax = amount * 0.05; // Tax is 5% of the amount
      const net = amount - tax; // Net is amount - tax

      // Send all required data (amount, tax, and net)
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,  // Pass amount
          tax: tax,        // Pass tax (5% of amount)
          net: net,        // Pass net (amount - tax)
        }),
        credentials: "include", // If needed for cookies/session
      });

      if (response.ok) {
        console.log("Withdrawal successful!");
        // After withdrawal success, navigate to the withdraw page
        router.push("/withdraw");
      } else {
        const data = await response.json();
        console.error("Withdrawal failed:", data.error); // Log the error from the API
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Withdrawal Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        onClick={handleWithdraw}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
      >
        Withdraw Now
      </button>
    </div>
  );
};

export default WithdrawButton;
