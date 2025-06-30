import React from 'react';

export default function Report({ members, meals, expenses }) {
  // সবার meal summary বের করো (memberwise meal structure)
  const mealSummary = {};
  members.forEach(m => (mealSummary[m] = 0));
  meals.forEach(meal => {
    if (meal.meals) {
      // memberwise structure: meal.meals = { Rahim: {breakfast, lunch, dinner}, ... }
      members.forEach(m => {
        if (meal.meals[m]) {
          mealSummary[m] +=
            Number(meal.meals[m].breakfast || 0) +
            Number(meal.meals[m].lunch || 0) +
            Number(meal.meals[m].dinner || 0);
        }
      });
    } else {
      // fallback: পুরনো স্ট্রাকচারের জন্য
      members.forEach(m => {
        mealSummary[m] += ((Number(meal.breakfast) + Number(meal.lunch) + Number(meal.dinner)) / members.length);
      });
    }
  });

  // সবার কতো টাকা দিয়েছে, তার হিসাব
  const expenseSummary = {};
  members.forEach(m => (expenseSummary[m] = 0));
  expenses.forEach(ex => {
    if (expenseSummary[ex.member] !== undefined) {
      expenseSummary[ex.member] += Number(ex.amount);
    }
  });

  // মোট meal, মোট খরচ, meal rate
  const totalMeals = Object.values(mealSummary).reduce((a, b) => a + b, 0);
  const totalExpense = Object.values(expenseSummary).reduce((a, b) => a + b, 0);
  const mealRate = totalMeals ? (totalExpense / totalMeals).toFixed(2) : 0;

  // কার কার কত বাকি বা পাওনা
  const dues = members.map(m => ({
    name: m,
    meals: mealSummary[m].toFixed(2),
    paid: expenseSummary[m].toFixed(2),
    cost: (mealSummary[m] * mealRate).toFixed(2),
    balance: (expenseSummary[m] - mealSummary[m] * mealRate).toFixed(2),
  }));

  return (
    <section className="mb-4">
      <h4 className="fw-semibold mb-3">📊 রিপোর্ট ও হিসাব</h4>
      <table className="table table-bordered text-center align-middle">
        <thead className="table-secondary">
          <tr>
            <th>নাম</th>
            <th>মোট মিল</th>
            <th>দিয়েছে (৳)</th>
            <th>মিল বাবদ (৳)</th>
            <th>ব্যালেন্স (৳)</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((d, i) => (
            <tr key={i}>
              <td>{d.name}</td>
              <td>{d.meals}</td>
              <td>{d.paid}</td>
              <td>{d.cost}</td>
              <td className={Number(d.balance) < 0 ? 'text-danger' : 'text-success'}>
                {d.balance}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="table-primary fw-bold">
            <td>মোট</td>
            <td>{totalMeals.toFixed(2)}</td>
            <td>{totalExpense.toFixed(2)}</td>
            <td colSpan={2}>মিল রেট: <b>{mealRate}</b></td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
