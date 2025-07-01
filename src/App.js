import React, { useState, useEffect, useCallback } from 'react';
// ...rest of imports
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import MemberList from './components/MemberList';
import Meal from './components/Meal'; // শুধু meal হিসাব দেখার জন্য
import MealEntry from './components/MealEntry'; // সদস্য meal entry (vertical/card style)
import ExpenseEntry from './components/ExpenseEntry';
import Report from './components/Report';

import { AuthProvider, useAuth } from './AuthContext';
import SignInSignUp from './components/SignInSignUp';

// Navigation Component (সবুজ ট্যাব)
function Navigation() {
  const location = useLocation();
  const getClass = (path) =>
    `btn btn-outline-success${location.pathname === path ? ' active fw-bold' : ''}`;

  return (
    <nav className="mb-4 d-flex gap-3 justify-content-center">
      <Link className={getClass("/members")} to="/members">মেম্বার</Link>
      <Link className={getClass("/meals")} to="/meals">মিল</Link>
      <Link className={getClass("/meal-entry")} to="/meal-entry">মিল এন্ট্রি</Link>
      <Link className={getClass("/expenses")} to="/expenses">খরচ</Link>
      <Link className={getClass("/report")} to="/report">রিপোর্ট</Link>
    </nav>
  );
}

// MainApp: Auth + main logic
function MainApp() {
  const { user, signout } = useAuth();

  // 👉 ইউজার ভেদে লোকালস্টোরেজ-কি গুলো আলাদা করতে userKey ফাংশন
  const userKey = useCallback(
  (key) => user ? `${key}-${user.username}` : key,
  [user]
);
  // ইউজার অনুযায়ী ডাটা লোডার ফাংশন
  const getLS = (key, fallback) => {
  const data = localStorage.getItem(userKey(key));
  try {
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};
  // State with Local Storage Sync (user change হলে রিলোড হবে)
  const [members, setMembers] = useState(() => getLS('members', ['Rahim', 'Karim', 'Selim']));
  const [meals, setMeals] = useState(() => getLS('meals', []));
  const [expenses, setExpenses] = useState(() => getLS('expenses', []));

  // ইউজার চেঞ্জ হলেই তার ডাটা লোড
  useEffect(() => {
    if (user) {
      setMembers(getLS('members', ['Rahim', 'Karim', 'Selim']));
      setMeals(getLS('meals', []));
      setExpenses(getLS('expenses', []));
    }
    // eslint-disable-next-line
  }, [user]);

  // লোকালস্টোরেজে রিয়েল টাইম সেভ
  useEffect(() => { if (user) localStorage.setItem(userKey('members'), JSON.stringify(members)); }, [members, user]);
  useEffect(() => { if (user) localStorage.setItem(userKey('meals'), JSON.stringify(meals)); }, [meals, user]);
  useEffect(() => { if (user) localStorage.setItem(userKey('expenses'), JSON.stringify(expenses)); }, [expenses, user]);

  // ==== Member Functions ====
  const addMember = (name) => setMembers([...members, name]);
  const deleteMember = (index) => setMembers(members.filter((_, i) => i !== index));
  const editMember = (index, newName) => setMembers(members.map((m, i) => (i === index ? newName : m)));

  // ==== Meal Functions ====
  const addMeal = (meal) => setMeals([...meals, meal]);
  const deleteMeal = (index) => setMeals(meals.filter((_, i) => i !== index));
  const editMeal = (index, updatedMeal) => setMeals(meals.map((meal, i) => (i === index ? updatedMeal : meal)));

  // ==== Expense Functions ====
  const addExpense = (expense) => setExpenses([...expenses, expense]);
  const deleteExpense = (index) => setExpenses(expenses.filter((_, i) => i !== index));
  const editExpense = (index, updatedExpense) => setExpenses(expenses.map((ex, i) => (i === index ? updatedExpense : ex)));

  // Export/Import
  const handleExport = () => {
    const data = { members, meals, expenses };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mess-hishab-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.members && data.meals && data.expenses) {
          setMembers(data.members);
          setMeals(data.meals);
          setExpenses(data.expenses);
          alert("ডেটা সফলভাবে ইমপোর্ট হয়েছে!");
        } else {
          alert("ভুল ফাইল/ফরম্যাট!");
        }
      } catch {
        alert("ভুল ফাইল/ফরম্যাট!");
      }
    };
    reader.readAsText(file);
  };

  const backupPanel = (
    <div className="d-flex justify-content-end mb-3">
      <button className="btn btn-success me-2" onClick={handleExport}>
        ডেটা এক্সপোর্ট (Backup)
      </button>
      <label className="btn btn-outline-success mb-0">
        ডেটা ইমপোর্ট
        <input
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </label>
    </div>
  );

  // Auth check: logged in user না থাকলে sign-in page দেখাও
  if (!user) return <SignInSignUp />;

  return (
    <Router>
      <div className="container my-5">
        <div className="card shadow-lg rounded-4 p-4">
          {/* User Bar */}
          <div className="d-flex justify-content-end mb-2">
            <span className="me-3 text-success">👤 {user.username}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={signout}>Logout</button>
          </div>
          <h2 className="text-center mb-4 text-success fw-bold">Mess Hishab</h2>
          <h4 className="text-center mb-4 text-success">Created by Tanjil</h4>
          {/* Navigation Bar */}
          <Navigation />
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Navigate to="/report" />} />
            <Route path="/members" element={
              <MemberList
                members={members}
                addMember={addMember}
                deleteMember={deleteMember}
                editMember={editMember}
              />
            } />
            <Route path="/meals" element={
              <Meal
                members={members}
                meals={meals}
              />
            } />
            <Route path="/meal-entry" element={
              <MealEntry
                members={members}
                meals={meals}
                addMeal={addMeal}
                deleteMeal={deleteMeal}
                editMeal={editMeal}
              />
            } />
            <Route path="/expenses" element={
              <ExpenseEntry
                expenses={expenses}
                members={members}
                addExpense={addExpense}
                editExpense={editExpense}
                deleteExpense={deleteExpense}
              />
            } />
            <Route path="/report" element={
              <div>
                {backupPanel}
                <Report members={members} meals={meals} expenses={expenses} />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// শুধুমাত্র এখানে AuthProvider দিয়ে wrap করুন
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
