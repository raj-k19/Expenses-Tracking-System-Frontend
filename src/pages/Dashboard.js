import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../components/Navbar";
import { useCallback } from "react";



import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
  });

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchData = useCallback(async () => {
    try {
      const summaryRes = await API.get("/budget/summary");
      const transactionRes = await API.get("/transactions");
  
      setSummary(summaryRes.data);
      setTransactions(transactionRes.data);
  
    } catch (error) {
      alert("Session expired. Please login again.");
      navigate("/");
    }
  }, [navigate]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetBudget = async () => {
    if (!budgetInput) {
      alert("Please enter a budget amount");
      return;
    }
  
    try {
      await API.post("/budget", {
        monthlyLimit: Number(budgetInput),
      });
  
      alert("Budget Set Successfully");
      setBudgetInput("");
      fetchData();
    } catch (error) {
      alert("Error setting budget");
    }
  };
  
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });

      alert("Transaction Added");

      setForm({ type: "expense", amount: "", category: "" });
      
     fetchData();

    } catch (error) {
      alert("Error adding transaction");
    }
  };

  // Prepare Pie Chart Data (Expense by Category)
 const filteredTransactions =
  selectedMonth === "all"
    ? transactions
    : transactions.filter(
        (t) =>
          new Date(t.date).getMonth().toString() === selectedMonth
      );

const expenseData = filteredTransactions.filter(
  (t) => t.type === "expense"
);

  const categoryTotals = {};
  expenseData.forEach((t) => {
    categoryTotals[t.category] =
      (categoryTotals[t.category] || 0) + t.amount;
  });

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const filteredIncome = filteredTransactions
  .filter((t) => t.type === "income")
  .reduce((acc, curr) => acc + curr.amount, 0);

const filteredExpense = filteredTransactions
  .filter((t) => t.type === "expense")
  .reduce((acc, curr) => acc + curr.amount, 0);

  const barData = {

    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [filteredIncome, filteredExpense],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const monthlyBudget = summary?.monthlyBudget || 0;

const budgetUsage =
  monthlyBudget > 0
    ? (filteredExpense / monthlyBudget) * 100
    : 0;

  const exportPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 14, 20);
  
    doc.setFontSize(12);
    doc.text(`Month: ${selectedMonth === "all" ? "All" : selectedMonth}`, 14, 30);
  
    doc.text(`Total Income: ₹ ${filteredIncome}`, 14, 40);
    doc.text(`Total Expense: ₹ ${filteredExpense}`, 14, 48);
    doc.text(`Balance: ₹ ${filteredIncome - filteredExpense}`, 14, 56);
  
    autoTable(doc, {
      startY: 65,
      head: [["Type", "Amount", "Category", "Date"]],
      body: filteredTransactions.map((t) => [
        t.type,
        t.amount,
        t.category,
        new Date(t.date).toLocaleDateString(),
      ]),
    });
  
    doc.save("Expense_Report.pdf");
  };
  const remainingBudget = monthlyBudget - filteredExpense;

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto">
  
        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          logout={logout}
        />
  
        {/* Set Budget Section */}
        {monthlyBudget === 0 && (
          <div
            className={`shadow p-4 rounded mb-6 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">
              Set Monthly Budget
            </h3>
  
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Enter Monthly Budget"
                className={`p-2 rounded border ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black"
                }`}
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
  
              <button
                onClick={handleSetBudget}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Budget
              </button>
            </div>
          </div>
        )}
  
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`shadow p-4 rounded ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <h4 className="text-gray-500">Income</h4>
              <p className="text-xl font-bold text-green-600">
                ₹ {filteredIncome}
              </p>
            </div>
  
            <div className={`shadow p-4 rounded ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <h4 className="text-gray-500">Expense</h4>
              <p className="text-xl font-bold text-red-600">
                ₹ {filteredExpense}
              </p>
            </div>
  
            <div className={`shadow p-4 rounded ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <h4 className="text-gray-500">Balance</h4>
              <p className="text-xl font-bold text-blue-600">
                ₹ {filteredIncome - filteredExpense}
              </p>
            </div>
  
            <div className={`shadow p-4 rounded ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <h4 className="text-gray-500">Remaining Budget</h4>
              <p className={`text-xl font-bold ${
                remainingBudget < 0
                  ? "text-red-600"
                  : "text-purple-600"
              }`}>
                ₹ {remainingBudget}
              </p>
            </div>
          </div>
        )}
  
        {/* Budget Warning */}
        {monthlyBudget > 0 && (
          <div className="mb-6">
            {budgetUsage >= 100 ? (
              <div className="bg-red-500 text-white p-4 rounded shadow">
                🚨 You have exceeded your monthly budget!
              </div>
            ) : budgetUsage >= 80 ? (
              <div className="bg-yellow-400 text-black p-4 rounded shadow">
                ⚠ Warning: You have used {budgetUsage.toFixed(1)}% of your budget.
              </div>
            ) : (
              <div className="bg-green-500 text-white p-4 rounded shadow">
                ✅ You are within safe budget range.
              </div>
            )}
          </div>
        )}
  
        {/* Add Transaction */}
        <div className={`shadow p-4 rounded mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h3 className="text-xl font-semibold mb-4">
            Add Transaction
          </h3>
  
          <form
            onSubmit={handleAddTransaction}
            className="flex flex-col md:flex-row gap-4"
          >
            <select
              className={`p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black"
              }`}
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
  
            <input
              type="number"
              placeholder="Amount"
              className={`p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black"
              }`}
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
  
            <input
              type="text"
              placeholder="Category"
              className={`p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black"
              }`}
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />
  
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </div>
  
        {/* Filter + Export */}
        <div className="mb-6 flex items-center gap-4">
          <select
            className={`p-2 rounded border ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
            }`}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
  
          <button
            onClick={exportPDF}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export PDF
          </button>
        </div>
  
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`shadow p-4 rounded ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className="mb-4 font-semibold">
              Expense by Category
            </h3>
            <Pie data={pieData} />
          </div>
  
          <div className={`shadow p-4 rounded ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className="mb-4 font-semibold">
              Income vs Expense
            </h3>
            <Bar data={barData} />
          </div>
        </div>
  
        {/* Transaction History */}
        <div className={`shadow p-4 rounded ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h3 className="text-xl font-semibold mb-4">
            Transaction History
          </h3>
  
          <ul className="space-y-2">
            {filteredTransactions.map((t) => (
              <li
                key={t._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {t.type.toUpperCase()} - ₹{t.amount} - {t.category}
                </span>
  
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this transaction?"
                    );
                    if (!confirmDelete) return;
  
                    try {
                      await API.delete(`/transactions/${t._id}`);
                      fetchData();
                    } catch (error) {
                      alert("Error deleting transaction");
                    }
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
  
      </div>
    </div>
  );;
}