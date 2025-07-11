import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import MemberList from "./components/MemberList";
import Meal from "./components/Meal";
import MealEntry from "./components/MealEntry";
import ExpenseEntry from "./components/ExpenseEntry";
import Report from "./components/Report";

// Firebase Auth/Firestore
import { FirebaseAuthProvider, useFirebaseAuth } from './FirebaseAuthContext';
import SignInSignUp from './components/SignInSignUp';
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// ===== Toastify Import =====
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function MainApp() {
  const { user, signout } = useFirebaseAuth();

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const [members, setMembers] = useState(["Rahim", "Karim", "Selim"]);
  const [meals, setMeals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [messName, setMessName] = useState("");
  const [editMessName, setEditMessName] = useState(false);

  const [editMealIdx, setEditMealIdx] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getDocRef = (key) => {
    if (!user) return null;
    return doc(db, "users", user.email, "months", selectedMonth + "-" + key);
  };

  useEffect(() => {
    if (!user) return;
    const unsubMembers = onSnapshot(getDocRef("members"), (snap) => {
      setMembers(snap.exists() ? snap.data().list : ["Rahim", "Karim", "Selim"]);
    });
    const unsubMeals = onSnapshot(getDocRef("meals"), (snap) => {
      setMeals(snap.exists() ? snap.data().list : []);
    });
    const unsubExpenses = onSnapshot(getDocRef("expenses"), (snap) => {
      setExpenses(snap.exists() ? snap.data().list : []);
    });
    const unsubMessName = onSnapshot(getDocRef("messName"), (snap) => {
      setMessName(snap.exists() ? snap.data().value : "Mess Hishab");
    });
    return () => {
      unsubMembers();
      unsubMeals();
      unsubExpenses();
      unsubMessName();
    };
  }, [user, selectedMonth]);

  const saveDoc = async (key, val) => {
    if (!user) return;
    await setDoc(getDocRef(key), val, { merge: true });
  };

  const addMember = (name) => saveDoc("members", { list: [...members, name] });
  const deleteMember = (idx) => saveDoc("members", { list: members.filter((_, i) => i !== idx) });
  const editMember = (idx, newName) =>
    saveDoc("members", { list: members.map((m, i) => (i === idx ? newName : m)) });

  const addMeal = (meal) => saveDoc("meals", { list: [...meals, meal] });

  const handleDeleteMeal = (idx) => {
    if (window.confirm("আপনি কি এই Meal ডিলিট করতে চান?")) {
      saveDoc("meals", { list: meals.filter((_, i) => i !== idx) });
    }
  };

  const handleEditMeal = (idx) => {
    setEditMealIdx(idx);
    setEditModalOpen(true);
  };

  const saveEditMeal = (editIdx, updatedMeal) => {
    saveDoc("meals", {
      list: meals.map((m, i) => (i === editIdx ? updatedMeal : m)),
    });
    setEditModalOpen(false);
    setEditMealIdx(null);
  };

  const addExpense = (ex) => saveDoc("expenses", { list: [...expenses, ex] });
  const deleteExpense = (idx) => saveDoc("expenses", { list: expenses.filter((_, i) => i !== idx) });
  const editExpense = (idx, updatedEx) =>
    saveDoc("expenses", { list: expenses.map((e, i) => (i === idx ? updatedEx : e)) });

  const handleMessNameSave = () => {
    saveDoc("messName", { value: messName });
    setEditMessName(false);
  };

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
          saveDoc("members", { list: data.members });
          saveDoc("meals", { list: data.meals });
          saveDoc("expenses", { list: data.expenses });
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

  if (!user) return <SignInSignUp />;

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
                onEdit={handleEditMeal}
                onDelete={handleDeleteMeal}
              />
            } />
            <Route path="/meal-entry" element={
              <MealEntry
                members={members}
                meals={meals}
                addMeal={addMeal}
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

        {/* --- Meal Edit Modal (works from any route, even /meals) --- */}
        {editModalOpen && (
          <MealEntry
            members={members}
            meals={meals}
            editIdx={editMealIdx}
            meal={meals[editMealIdx]}
            saveEditMeal={saveEditMeal}
            setEditModalOpen={setEditModalOpen}
            editModalOpen={editModalOpen}
          />
        )}
      </div>
      {/* === Toast Container (Always at the End of Router) === */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="custom-toast-center" // <== Add this
        toastClassName="custom-toast-center-inner" // <== Add this
      />
    </Router>
  );
}

export default function App() {
  return (
    <FirebaseAuthProvider>
      <MainApp />
    </FirebaseAuthProvider>
  );
}
