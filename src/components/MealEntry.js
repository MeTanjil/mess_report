import React, { useState, useEffect } from 'react';
// Toastify import
import { toast } from "react-toastify";

export default function MealEntry({
  members = [],
  addMeal,
  meals = [],
  editIdx = null,
  meal = null,
  saveEditMeal,
  setEditModalOpen,
  editModalOpen
}) {
  const [date, setDate] = useState('');
  const [memberMeals, setMemberMeals] = useState({});
  const isEdit = typeof editIdx === 'number' && meal;

  // Helper: empty meal for a member
  const getEmptyMeals = () => ({ breakfast: '', lunch: '', dinner: '' });

  // On edit modal open/close or member list change, set form state
  useEffect(() => {
    if (isEdit) {
      setDate(meal.date);
      const safeMeals = {};
      members.forEach(m => {
        safeMeals[m] = meal.meals?.[m] || getEmptyMeals();
      });
      setMemberMeals(safeMeals);
    } else {
      setDate('');
      const reset = {};
      members.forEach(m => {
        reset[m] = getEmptyMeals();
      });
      setMemberMeals(reset);
    }
    // eslint-disable-next-line
  }, [isEdit, meal, members, editModalOpen]);

  // Always sync memberMeals when members change (for add/remove member edge case)
  useEffect(() => {
    setMemberMeals(prev => {
      const updated = { ...prev };
      members.forEach(m => {
        if (!updated[m]) updated[m] = getEmptyMeals();
      });
      // Remove keys for members who no longer exist
      Object.keys(updated).forEach(m => {
        if (!members.includes(m)) delete updated[m];
      });
      return updated;
    });
  }, [members]);

  // Meal input change handler
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

  // Form submit: add or edit meal
  const handleSubmit = e => {
    e.preventDefault();
    if (!date) return;

    // === Duplicate meal date check (only in Add mode) ===
    if (!isEdit && meals.some(m => m.date === date)) {
      toast.error("❌ এই তারিখের Meal আগেই এন্ট্রি করা হয়েছে!");
      return;
    }

    const mealData = {};
    members.forEach(m => {
      mealData[m] = {
        breakfast: Number(memberMeals[m]?.breakfast || 0),
        lunch: Number(memberMeals[m]?.lunch || 0),
        dinner: Number(memberMeals[m]?.dinner || 0),
      };
    });

    if (isEdit && saveEditMeal) {
      saveEditMeal(editIdx, { date, meals: mealData });
      setEditModalOpen && setEditModalOpen(false);
    } else if (addMeal) {
      addMeal({ date, meals: mealData });
      // === Stylish Toast for Add Mode ===
      toast.success("✅ আপনার Meal এন্ট্রি সফলভাবে যোগ হয়েছে!");
    }
    // Reset form in add mode
    if (!isEdit) {
      setDate('');
      const reset = {};
      members.forEach(m => {
        reset[m] = getEmptyMeals();
      });
      setMemberMeals(reset);
    }
  };

  // Close modal in edit mode
  const handleClose = () => setEditModalOpen && setEditModalOpen(false);

  // Form UI content
  const FormContent = (
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
            disabled={isEdit} // Edit-এ তারিখ চেঞ্জ করতে দিবে না (চাইলে enable রাখো)
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
      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-success px-4">
          {isEdit ? "আপডেট" : "অ্যাড"}
        </button>
        {isEdit && (
          <button type="button" className="btn btn-secondary px-4" onClick={handleClose}>
            বাতিল
          </button>
        )}
      </div>
    </form>
  );

  // Show modal for edit, else normal form for add
  if (editModalOpen) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
        style={{ zIndex: 9999 }}
      >
        <div className="bg-white rounded-4 p-4 shadow-lg" style={{ minWidth: 380 }}>
          <h4 className="fw-bold text-success mb-3 fs-4 border-bottom pb-2">🍛 Meal Edit</h4>
          {FormContent}
        </div>
      </div>
    );
  }

  // Add Mode (পেইজে ফর্ম)
  return (
    <section className="mb-4">
      <h4 className="fw-bold text-success mb-3 fs-4 border-bottom pb-2">
        🍛 সদস্য Meal এন্ট্রি
      </h4>
      {FormContent}
    </section>
  );
}
