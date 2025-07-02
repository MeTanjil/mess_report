import React from 'react';

export default function Report({ members, meals, expenses }) {
  // সদস্য-ভিত্তিক মোট meal হিসাব
  const mealSummary = {};
  members.forEach(m => (mealSummary[m] = 0));
  meals.forEach(meal => {
    if (meal.meals) {
      // memberwise হিসাব
      members.forEach(m => {
        if (meal.meals[m]) {
          mealSummary[m] +=
            Number(meal.meals[m].breakfast || 0) +
            Number(meal.meals[m].lunch || 0) +
            Number(meal.meals[m].dinner || 0);
        }
      });
    } else {
      // পুরনো ডেটার fallback (সবাই সমান ভাগ)
      members.forEach(m => {
        mealSummary[m] += (
          (Number(meal.breakfast) + Number(meal.lunch) + Number(meal.dinner))
          / members.length
        );
      });
    }
  });

  // সদস্য-ভিত্তিক মোট খরচ
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

  // সদস্য-ভিত্তিক রিপোর্ট
  const dues = members.map(m => ({
    name: m,
    meals: mealSummary[m].toFixed(2),
    paid: expenseSummary[m].toFixed(2),
    cost: (mealSummary[m] * mealRate).toFixed(2),
    balance: (expenseSummary[m] - mealSummary[m] * mealRate).toFixed(2),
  }));

  return (
    <section className="mb-4">
      <h4 className="fw-bold text-success mb-3 fs-4 border-bottom pb-2">📊 রিপোর্ট ও হিসাব</h4>
      <table className="table table-bordered table-hover text-center align-middle rounded-4 overflow-hidden">
        <thead className="table-success">
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
              <td className="fw-semibold">{d.name}</td>
              <td>{d.meals}</td>
              <td>{d.paid}</td>
              <td>{d.cost}</td>
              <td className={Number(d.balance) < 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
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
