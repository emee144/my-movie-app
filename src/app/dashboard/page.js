"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WithdrawButton from "@/components/WithdrawButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WithdrawalSection from "@/components/WithdrawalSection"; 
import WithdrawalHistory from "@/components/WithdrawalHistory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DashboardSkeleton = () => (
  <div className="flex flex-col space-y-4">
    <Skeleton className="h-6 w-48 bg-gray-300" />
    <Skeleton className="h-6 w-64 bg-gray-300" />
    <Skeleton className="h-48 w-full bg-gray-300" />
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ accountName: "", email: "" });
  const [withdrawal, setWithdrawal] = useState({ method: "", accountName: "", accountNumber: "", bankName: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [showWithdrawalSection, setShowWithdrawalSection] = useState(false);
  const [showSavedBankDetails, setShowSavedBankDetails] = useState(false);

  const handleAccountNameChange = (e) => {
    const newAccountName = e.target.value;
    setProfile((prevState) => ({ ...prevState, accountName: newAccountName }));
    setWithdrawal((prevState) => ({ ...prevState, accountName: newAccountName }));
  };

  const toggleWithdrawalSection = () => {
    setShowWithdrawalSection(!showWithdrawalSection);
  };

  const toggleSavedBankDetails = () => {
    setShowSavedBankDetails(!showSavedBankDetails);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data.user);
        setProfile({ accountName: data.accountName, email: data.email });

        const withdrawalRes = await fetch("/api/auth/withdrawal-settings", {
          method: "GET",
          credentials: "include",
        });

        if (withdrawalRes.ok) {
          const withdrawalData = await withdrawalRes.json();
          setWithdrawal({
            method: withdrawalData.withdrawalMethod || "",
            accountName: withdrawalData.accountName || "",
            bankName: withdrawalData.bankName || "",
            accountNumber: withdrawalData.accountNumber || "",
          });
        }

        const historyRes = await fetch("/api/auth/withdrawal-history", {
          method: "GET",
          credentials: "include",
        });

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setWithdrawalHistory(historyData.history || []);
        }

      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmitWithdrawal = async () => {
    if (withdrawal.accountNumber.length !== 10) {
      setError("Account number must be exactly 10 digits");
      return;
    }
    const res = await fetch("/api/auth/withdrawal-settings", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        withdrawalMethod: withdrawal.method,
        accountName: withdrawal.accountName,
        bankName: withdrawal.bankName,
        accountNumber: withdrawal.accountNumber,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(data.message);
      setError("");
    } else {
      setError(data.error);
      setSuccess("");
    }
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setWithdrawal({ ...withdrawal, accountNumber: value });
      setError("");
    } else {
      setError("Account number must be exactly 10 digits");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(data.message);
      setError("");
    } else {
      setError(data.error);
      setSuccess("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-30 bg-yellow-300 transition-all duration-500 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900 transition-transform transform hover:scale-105">
          Account Settings
        </h1>
        
        <div className="flex space-x-4">
          <WithdrawButton onClick={toggleWithdrawalSection} className="bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300">
            Withdraw
          </WithdrawButton>
          <Button
            onClick={() => {
              fetch("/api/auth/logout", { method: "POST", credentials: "include" })
                .then(() => router.push("/login"));
            }}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-500 transition duration-200">Profile</TabsTrigger>
          <TabsTrigger value="withdrawal" className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-500 transition duration-200">Withdrawal</TabsTrigger>
          <TabsTrigger value="history" className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-500 transition duration-200">History</TabsTrigger>
          <TabsTrigger value="security" className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-500 transition duration-200">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Account Name"
                  value={profile.accountName}
                  onChange={(e) => handleAccountNameChange(e)} 
                  className="mb-4 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mb-4 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <Button className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200">Save Changes</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="withdrawal">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={withdrawal.method} onValueChange={(value) => setWithdrawal({ ...withdrawal, method: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Withdrawal Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={withdrawal.accountName}
                  onChange={handleAccountNameChange}
                  placeholder="Account Name"
                  className="my-2 p-3 w-full border border-gray-300 rounded-md"
                />
                <Input
                  value={withdrawal.accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="Account Number"
                  className="my-2 p-3 w-full border border-gray-300 rounded-md"
                />
                <Input
                  value={withdrawal.bankName}
                  onChange={(e) => setWithdrawal({ ...withdrawal, bankName: e.target.value })}
                  placeholder="Bank Name"
                  className="my-2 p-3 w-full border border-gray-300 rounded-md"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <Button onClick={handleSubmitWithdrawal} className="w-full mt-4 bg-blue-500 mb-14 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200">
                  Save Withdrawal Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                <WithdrawalHistory withdrawalHistory={withdrawalHistory} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
                className="my-2 p-3 w-full border border-gray-300 rounded-md"
              />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="my-2 p-3 w-full border border-gray-300 rounded-md"
              />
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="my-2 p-3 w-full border border-gray-300 rounded-md"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button onClick={handleChangePassword} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Saved Bank Details */}
      {showSavedBankDetails && (
        <div className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:bg-blue-600">
          <h3 className="font-bold">Saved Bank Details</h3>
          <p>Account Name: {withdrawal.accountName}</p>
          <p>Account Number: {withdrawal.accountNumber}</p>
          <Button onClick={toggleSavedBankDetails} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Close</Button>
        </div>
      )}
    </div>
  );
}