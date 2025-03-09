import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentsHistories from "../components/PendingPayments";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <PaymentsHistories />
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Account Number</th>
            <th className="p-2">Balance (USD)</th>
            <th className="p-2">Balance (GBP)</th>
            <th className="p-2">Balance (EUR)</th>
            <th className="p-2">Balance (IRR)</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users?.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.accountNumber}</td>
                <td className="p-2">{user.balance.USD}</td>
                <td className="p-2">{user.balance.GBP}</td>
                <td className="p-2">{user.balance.EUR}</td>
                <td className="p-2">{user.balance.IRR}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
