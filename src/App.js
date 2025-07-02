import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import MemberList from './components/MemberList';
import Meal from './components/Meal';
import MealEntry from './components/MealEntry';
import ExpenseEntry from './components/ExpenseEntry';
import Report from './components/Report';

// এই দুইটা লাইনের মধ্যে শুধু FirebaseAuthProvider আর useFirebaseAuth ইমপোর্ট হবে
import { FirebaseAuthProvider, useFirebaseAuth } from './FirebaseAuthContext';
import SignInSignUp from './components/SignInSignUp';

// Navigation Component
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
  const { user, signout } = useFirebaseAuth();

  // লোকালস্টোরেজের key তৈরির ফাংশন (user + মাস)
  const userKey = useCallback(
    (key, month = null) => {
      let suffix = user ? `-${user.email}` : ''; // Firebase user object-এ .email থাকে
      if (month) suffix += `-${month}`;
      return key + suffix;
    },
    [user]
  );

  // মাস নির্বাচন (default: current month)
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  // Mess Name (প্রতি মাসে আলাদা)
  const [messName, setMessName] = useState('');
  const [editMessName, setEditMessName] = useState(false);

  // লোকালস্টোরেজ থেকে ডাটা আনার helper
  const getLS = (key, fallback, monthScoped = false) => {
    const k = monthScoped ? userKey(key, selectedMonth) : userKey(key);
    const data = localStorage.getItem(k);
    try {
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  // State with Local Storage Sync
  const [members, setMembers] = useState(() => getLS('members', ['Rahim', 'Karim', 'Selim']));
  const [meals, setMeals] = useState(() => getLS('meals', [], true));
  const [expenses, setExpenses] = useState(() => getLS('expenses', [], true));

  // ইউজার/মাস চেঞ্জ হলেই ডাটা লোড (messName সহ)
  useEffect(() => {
    if (user) {
      setMessName(getLS('messName', 'Mess Hishab', true)); // মাস ধরে Mess Name
      setMembers(getLS('members', ['Rahim', 'Karim', 'Selim']));
      setMeals(getLS('meals', [], true));
      setExpenses(getLS('expenses', [], true));
    }
    // eslint-disable-next-line
  }, [user, selectedMonth]);

  // লোকালস্টোরেজে সেভ (user/mess/month অনুযায়ী, বিশেষ করে messName-এ মাস দিবেন)
  useEffect(() => { if (user) localStorage.setItem(userKey('messName', selectedMonth), JSON.stringify(messName)); }, [messName, user, selectedMonth]);
  useEffect(() => { if (user) localStorage.setItem(userKey('members'), JSON.stringify(members)); }, [members, user]);
  useEffect(() => { if (user) localStorage.setItem(userKey('meals', selectedMonth), JSON.stringify(meals)); }, [meals, user, selectedMonth]);
  useEffect(() => { if (user) localStorage.setItem(userKey('expenses', selectedMonth), JSON.stringify(expenses)); }, [expenses, user, selectedMonth]);

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

  // Export/Import (মাস ধরে backup/restore)
  const handleExport = () => {
    const data = { members, meals, expenses };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `mess-hishab-backup-${selectedMonth}.json`;
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

  // Mess Name Edit Handler
  const handleMessNameSave = () => setEditMessName(false);

  // Auth check: logged in user না থাকলে sign-in page দেখাও
  if (!user) return <SignInSignUp />;

  return (
    <Router>
      <div className="container my-5">
        <div className="card shadow-lg rounded-4 p-4">

          {/* Header with Mess Name & Month Selector */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              {!editMessName ? (
                <h2 className="text-success fw-bold mb-1">
                  {messName}
                  <button onClick={() => setEditMessName(true)} className="btn btn-link btn-sm ms-2">✎</button>
                </h2>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <input
                    className="form-control form-control-sm"
                    style={{ maxWidth: 220 }}
                    value={messName}
                    onChange={e => setMessName(e.target.value)}
                  />
                  <button className="btn btn-success btn-sm" onClick={handleMessNameSave}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMessName(false)}>Cancel</button>
                </div>
              )}
              <div className="text-secondary small">
                Created by Tanjil
              </div>
            </div>
            <div>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="form-control form-control-sm"
                style={{ minWidth: 160 }}
              />
            </div>
          </div>

          {/* User Bar */}
          <div className="d-flex justify-content-end mb-2">
            <span className="me-3 text-success">👤 {user.email}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={signout}>Logout</button>
          </div>

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

// শুধু FirebaseAuthProvider দিয়ে wrap করুন
export default function App() {
  return (
    <FirebaseAuthProvider>
      <MainApp />
    </FirebaseAuthProvider>
  );
}
