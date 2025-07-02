import React from 'react';

export default function Report({ members, meals, expenses }) {
  // সদস্য-ভিত্তিক মোট meal হিসাব (safe fallback)
  const mealSummary = {};
  members.forEach(m => (mealSummary[m] = 0));
  meals.forEach(meal => {
    if (meal.meals) {
      // memberwise হিসাব
      members.forEach(m => {
        const mm = meal.meals[m] || { breakfast: 0, lunch: 0, dinner: 0 };
        mealSummary[m] +=
          Number(mm.breakfast || 0) +
          Number(mm.lunch || 0) +
          Number(mm.dinner || 0);
      });
    } else {
      // পুরনো ডেটার fallback (সবাই সমান ভাগ)
      const sum = Number(meal.breakfast || 0) + Number(meal.lunch || 0) + Number(meal.dinner || 0);
      members.forEach(m => {
        mealSummary[m] += members.length ? sum / members.length : 0;
      });
    }
  });

  // সদস্য-ভিত্তিক মোট খরচ
  const expenseSummary = {};
  members.forEach(m => (expenseSummary[m] = 0));
  expenses.forEach(ex => {
    if (expenseSummary.hasOwnProperty(ex.member)) {
      expenseSummary[ex.member] += Number(ex.amount || 0);
    }
  });

  // মোট meal, মোট খরচ, meal rate
  const totalMeals = Object.values(mealSummary).reduce((a, b) => Number(a) + Number(b), 0);
  const totalExpense = Object.values(expenseSummary).reduce((a, b) => Number(a) + Number(b), 0);
  const mealRate = totalMeals > 0 ? (totalExpense / totalMeals) : 0;

  // সদস্য-ভিত্তিক রিপোর্ট
  const dues = members.map(m => {
    const mealsCount = Number(mealSummary[m] || 0);
    const paid = Number(expenseSummary[m] || 0);
    const cost = mealsCount * mealRate;
    const balance = paid - cost;
    return {
      name: m,
      meals: mealsCount.toFixed(2),
      paid: paid.toFixed(2),
      cost: cost.toFixed(2),
      balance: balance.toFixed(2),
    };
  });

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
            <td colSpan={2}>মিল রেট: <b>{mealRate ? mealRate.toFixed(2) : 0}</b></td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
