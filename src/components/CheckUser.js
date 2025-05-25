"use client";
import { useEffect, useState } from "react";

const CheckUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!user) return <div>Loading user info...</div>;

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">User Information</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Withdrawal Method:</strong> {user.withdrawalMethod}</p>
      <p><strong>Account Name:</strong> {user.accountName}</p>
      <p><strong>Bank Name:</strong> {user.bankName}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default CheckUser;
