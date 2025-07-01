import React, { useState, useEffect } from 'react';

export default function MealEntry({ members, addMeal, editMeal, meals }) {
  const [date, setDate] = useState('');
  const [memberMeals, setMemberMeals] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  // সদস্য আপডেট হলে meal state reset
  useEffect(() => {
    const reset = {};
    members.forEach(m => {
      reset[m] = { breakfast: '', lunch: '', dinner: '' };
    });
    setMemberMeals(reset);
  }, [members]);

  // Edit হলে আগের ভ্যালু বসাও (এইটা না রাখলেও চলবে)
  useEffect(() => {
    if (editIndex !== null && meals && meals[editIndex]) {
      setDate(meals[editIndex].date);
      setMemberMeals(meals[editIndex].meals);
    }
  }, [editIndex, meals]);

  const handleChange = (member, mealType, value) => {
    if (
      value === '' ||
      /^(0(\.5)?|1(\.5)?|2(\.5)?|3(\.5)?|4(\.5)?|5(\.5)?)$/.test(value)
    ) {
      setMemberMeals(prev => ({
        ...prev,
        [member]: { ...prev[member], [mealType]: value }
      }));
    }
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

  return (
    <section className="mb-4">
      <h4 className="fw-bold text-success mb-3 fs-4 border-bottom pb-2">
        🍛 সদস্য Meal এন্ট্রি
      </h4>
      <form className="p-3 bg-light rounded-4 border" onSubmit={handleSubmit} autoComplete="off">
        <div className="row mb-3">
          <div className="col-12 col-sm-5 col-md-4 mb-2 mb-sm-0">
            <input
              type="date"
              className="form-control form-control-lg"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>
        <div className="row g-3">
          {members.map(m => (
            <div className="col-12" key={m}>
              <div className="border rounded-4 p-3 shadow-sm bg-white d-flex flex-column flex-sm-row align-items-center gap-3">
                <div className="fw-bold text-success fs-5 mb-2 mb-sm-0 text-center" style={{ minWidth: 80 }}>
                  {m}
                </div>
                <div className="flex-grow-1 d-flex gap-2 justify-content-center">
                  <div>
                    <label className="small">সকাল</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      step="0.5"
                      max="5"
                      placeholder="0"
                      value={memberMeals[m]?.breakfast || ''}
                      onChange={e => handleChange(m, 'breakfast', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="small">দুপুর</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      step="0.5"
                      max="5"
                      placeholder="0"
                      value={memberMeals[m]?.lunch || ''}
                      onChange={e => handleChange(m, 'lunch', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="small">রাত</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      step="0.5"
                      max="5"
                      placeholder="0"
                      value={memberMeals[m]?.dinner || ''}
                      onChange={e => handleChange(m, 'dinner', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-success px-4">
            অ্যাড
          </button>
        </div>
      </form>
    </section>
  );
}
