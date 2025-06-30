import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import MemberList from './components/MemberList';
import MealEntry from './components/MealEntry';
import ExpenseEntry from './components/ExpenseEntry';
import Report from './components/Report';

// Navigation Component (সবুজ ট্যাব)
function Navigation() {
  const location = useLocation();
  const getClass = (path) =>
    `btn btn-outline-success${location.pathname === path ? ' active fw-bold' : ''}`;

  return (
    <nav className="mb-4 d-flex gap-3 justify-content-center">
      <Link className={getClass("/members")} to="/members">মেম্বার</Link>
      <Link className={getClass("/meals")} to="/meals">মিল</Link>
      <Link className={getClass("/expenses")} to="/expenses">খরচ</Link>
      <Link className={getClass("/report")} to="/report">রিপোর্ট</Link>
    </nav>
  );
}

function App() {
  const [members, setMembers] = useState(['Rahim', 'Karim', 'Selim']);
  const [meals, setMeals] = useState([]);
  const [expenses, setExpenses] = useState([
    { member: 'Rahim', amount: 200, date: '2025-06-29' }
  ]);

  // Member Actions
  const addMember = name => setMembers([...members, name]);
  const deleteMember = index => setMembers(members.filter((_, i) => i !== index));
  const editMember = (index, newName) =>
    setMembers(members.map((m, i) => (i === index ? newName : m)));

  // Meal Actions (memberwise)
  const addMeal = meal => setMeals([...meals, meal]);
  const deleteMeal = index => setMeals(meals.filter((_, i) => i !== index));
  const editMeal = (index, updatedMeal) =>
    setMeals(meals.map((meal, i) => (i === index ? updatedMeal : meal)));

  // Expense Actions
  const addExpense = expense => setExpenses([...expenses, expense]);
  const deleteExpense = index => setExpenses(expenses.filter((_, i) => i !== index));
  const editExpense = (index, updatedExpense) =>
    setExpenses(expenses.map((ex, i) => (i === index ? updatedExpense : ex)));

  return (
    <Router>
      <div className="container my-5">
        <div className="card shadow-lg rounded-4 p-4">
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
              <Report members={members} meals={meals} expenses={expenses} />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;