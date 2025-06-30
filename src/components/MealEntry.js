import React, { useState, useEffect } from 'react';

export default function MealEntry({ members, meals, addMeal, deleteMeal, editMeal }) {
  const [date, setDate] = useState('');
  const [memberMeals, setMemberMeals] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  // নতুন সদস্য যোগ হলে memberMeals আপডেট করো
  useEffect(() => {
    const init = {};
    members.forEach(m => {
      init[m] = { breakfast: '', lunch: '', dinner: '' };
    });
    setMemberMeals(init);
  }, [members]);

  // Edit এলে ফর্মে বসাও
  useEffect(() => {
    if (editIndex !== null && meals[editIndex]) {
      setDate(meals[editIndex].date);
      setMemberMeals(meals[editIndex].meals);
    }
  }, [editIndex, meals]);

  const handleChange = (member, mealType, value) => {
    setMemberMeals(prev => ({
      ...prev,
      [member]: {
        ...prev[member],
        [mealType]: value
      }
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!date) return;
    const mealData = {};
    members.forEach(m => {
      mealData[m] = {
        breakfast: memberMeals[m]?.breakfast === '' ? 0 : Number(memberMeals[m].breakfast),
        lunch: memberMeals[m]?.lunch === '' ? 0 : Number(memberMeals[m].lunch),
        dinner: memberMeals[m]?.dinner === '' ? 0 : Number(memberMeals[m].dinner),
      };
    });
    if (editIndex === null) {
      addMeal({ date, meals: mealData });
    } else {
      editMeal(editIndex, { date, meals: mealData });
    }
    setDate('');
    const reset = {};
    members.forEach(m => {
      reset[m] = { breakfast: '', lunch: '', dinner: '' };
    });
    setMemberMeals(reset);
    setEditIndex(null);
  };

  const handleEdit = (meal, index) => {
    setEditIndex(index);
  };

  return (
    <section className="mb-4">
      <h4 className="fw-semibold mb-3">🍛 সদস্যভিত্তিক মিল এন্ট্রি</h4>
      <table className="table table-bordered text-center align-middle mb-3">
        <thead className="table-secondary">
          <tr>
            <th>তারিখ</th>
            {members.map(m => (
              <th key={m} colSpan={3}>{m}</th>
            ))}
            <th>অ্যাকশন</th>
          </tr>
          <tr>
            <th></th>
            {members.map(m => (
              <React.Fragment key={m}>
                <th>সকাল</th>
                <th>দুপুর</th>
                <th>রাত</th>
              </React.Fragment>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal, i) => (
            <tr key={i}>
              <td>{meal.date}</td>
              {members.map(m => (
                <React.Fragment key={m}>
                  <td>{meal.meals[m]?.breakfast ?? 0}</td>
                  <td>{meal.meals[m]?.lunch ?? 0}</td>
                  <td>{meal.meals[m]?.dinner ?? 0}</td>
                </React.Fragment>
              ))}
              <td>
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => handleEdit(meal, i)}
                >
                  এডিট
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteMeal(i)}
                >
                  ডিলিট
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* নতুন meal entry */}
      <form className="row g-2 align-items-end" onSubmit={handleSubmit} autoComplete="off">
        <div className="col-12 mb-2">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <table className="table table-sm table-bordered text-center align-middle">
            <thead>
              <tr>
                <th>নাম</th>
                <th>সকাল</th>
                <th>দুপুর</th>
                <th>রাত</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m}>
                  <td>{m}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={memberMeals[m]?.breakfast || ''}
                      min="0"
                      step="0.5"
                      onChange={e => handleChange(m, 'breakfast', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={memberMeals[m]?.lunch || ''}
                      min="0"
                      step="0.5"
                      onChange={e => handleChange(m, 'lunch', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={memberMeals[m]?.dinner || ''}
                      min="0"
                      step="0.5"
                      onChange={e => handleChange(m, 'dinner', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-auto">
          <button type="submit" className={editIndex === null ? "btn btn-primary" : "btn btn-success"}>
            {editIndex === null ? "অ্যাড" : "আপডেট"}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setDate('');
                const reset = {};
                members.forEach(m => {
                  reset[m] = { breakfast: '', lunch: '', dinner: '' };
                });
                setMemberMeals(reset);
                setEditIndex(null);
              }}
            >
              বাতিল
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
