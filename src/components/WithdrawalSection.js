"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WithdrawalSection({ withdrawal, setWithdrawal }) {
  const [amount, setAmount] = useState(""); // Input amount
  const [tax, setTax] = useState(0); // Calculated tax
  const [net, setNet] = useState(0); // Net amount after tax
  const [statusMessage, setStatusMessage] = useState(""); // Success or error message
  const [history, setHistory] = useState([]); // Withdrawal history
  const [loading, setLoading] = useState(true); // Loading state

  const TAX_RATE = 0.05; // 5% tax rate
  
  // Calculate tax and net amount whenever the amount changes
  useEffect(() => {
    const amt = parseFloat(amount) || 0; // Parse the amount as a float
    const calculatedTax = amt * TAX_RATE; // Calculate tax
    setTax(calculatedTax); // Update tax state
    setNet(amt - calculatedTax); // Update net amount state
  }, [amount]);

  // Handle withdrawal submission
  const handleWithdrawal = async () => {
    if (!withdrawal?.accountName || !withdrawal?.bankName || !withdrawal?.accountNumber) {
      setStatusMessage("Please add your bank details before withdrawing.");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setStatusMessage("Please enter a valid amount.");
      return;
    }
    
    try {
      const numAmount = parseFloat(amount);
      
      // Make actual API call to create withdrawal
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          tax: tax,
          net: net
        }),
        credentials: "include", // Send cookies with the request
      });
      
      if (response.ok) {
        // Set success message
        setStatusMessage("Withdrawal successful!");
        
        // Fetch updated history
        try {
          const historyResponse = await fetch("/api/auth/withdrawal-history", {
            method: "GET",
            credentials: "include",
          });
          
          if (historyResponse.ok) {
            const data = await historyResponse.json();
            setHistory(data);
          }
        } catch (historyError) {
          console.error("Error fetching updated history:", historyError);
        }
      } else {
        const errorData = await response.json();
        setStatusMessage(`Withdrawal failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      // Set error message
      setStatusMessage("Withdrawal failed. Please try again.");
      console.error("Error processing withdrawal:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Withdrawal Input and Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bank Details Section */}
          {withdrawal?.accountName && withdrawal?.bankName && withdrawal?.accountNumber ? (
          <div className="mb-6 bg-lime-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-lime-800 mb-3">Saved Bank Details</h3>
          <p className="text-lime-700"><strong>Account Name:</strong> {withdrawal.accountName}</p>
          <p className="text-lime-700"><strong>Bank Name:</strong> {withdrawal.bankName}</p>
          <p className="text-lime-700"><strong>Account Number:</strong> {withdrawal.accountNumber}</p>
        </div>                 
          ) : (
            <p className="text-red-600">No bank details available. Please add your bank details.</p>
          )}

          {/* Input Fields for Amount */}
          <div className="mb-3">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Update amount state
              className="w-full"
            />
          </div>

          {/* Tax and Net Amount */}
          <div className="flex justify-between mb-3 text-lime-800l">
            <span>Tax (5%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3 text-lime-800">
            <span>Net Amount:</span>
            <span>${net.toFixed(2)}</span>
          </div>

          {/* Withdrawal Button */}
          <Button onClick={handleWithdrawal} className="font-bold bg-blue-700 text-white-900 mb-3 cursor-pointer">
            Withdraw
          </Button>
          {statusMessage && (
            <p className="mt-3 text-green-600">{statusMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p>No withdrawals yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Tax</th>
                  <th className="py-2">Net</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-t">
                    <td className="py-2">{entry.id}</td>
                    <td className="py-2">{new Date(entry.createdAt).toLocaleString()}</td>
                    <td className="py-2">${parseFloat(entry.amount).toFixed(2)}</td>
                    <td className="py-2">${parseFloat(entry.tax).toFixed(2)}</td>
                    <td className="py-2">${parseFloat(entry.net).toFixed(2)}</td>
                    <td className="py-2">{entry.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
