import React, { useState } from 'react';

export default function ExpenseEntry({ expenses, members, addExpense, editExpense, deleteExpense }) {
  const [member, setMember] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // সাবমিট করলে নতুন expense add বা edit
  const handleSubmit = e => {
    e.preventDefault();
    if (member && amount) {
      const expenseData = {
        member,
        amount: Number(amount),
        date: date || new Date().toISOString().split('T')[0]
      };
      if (editIndex === null) {
        addExpense(expenseData);
      } else {
        editExpense(editIndex, expenseData);
      }
      setMember('');
      setAmount('');
      setDate('');
      setEditIndex(null);
    }
  };

  // এডিট বাটনে পুরনো ডেটা বসাও
  const handleEdit = (ex, index) => {
    setMember(ex.member);
    setAmount(ex.amount.toString());
    setDate(ex.date);
    setEditIndex(index);
  };

  // বাতিল করলে ফর্ম রিসেট
  const handleCancel = () => {
    setMember('');
    setAmount('');
    setDate('');
    setEditIndex(null);
  };

  return (
    <section className="mb-4">
      <h4 className="fw-semibold text-success mb-3 fs-4 border-bottom pb-2">💵 খরচের হিসাব</h4>
      <ul className="list-group mb-3">
        {expenses.length === 0 && (
          <li className="list-group-item text-center text-secondary">এখনও কোনো খরচ যোগ হয়নি</li>
        )}
        {expenses.map((ex, i) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
            <span>
              <b>{ex.member}</b> দিয়েছে <b>{ex.amount}</b> টাকা <span className="text-muted">({ex.date})</span>
            </span>
            <span>
              <button
                className="btn btn-warning btn-sm me-1"
                onClick={() => handleEdit(ex, i)}
              >এডিট</button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteExpense(i)}
              >ডিলিট</button>
            </span>
          </li>
        ))}
      </ul>
      <form className="row g-2 align-items-end" onSubmit={handleSubmit} autoComplete="off">
        <div className="col">
          <select
            className="form-control"
            value={member}
            onChange={e => setMember(e.target.value)}
            required
          >
            <option value="">সদস্য নির্বাচন করুন</option>
            {members.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="খরচ (৳)"
            value={amount}
            min="1"
            step="1"
            onChange={e => setAmount(e.target.value)}
            required
            inputMode="numeric"
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="তারিখ"
          />
        </div>
        <div className="col-auto">
          <button type="submit" className={editIndex === null ? "btn btn-primary" : "btn btn-success"}>
            {editIndex === null ? "অ্যাড" : "আপডেট"}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleCancel}
            >বাতিল</button>
          )}
        </div>
      </form>
    </section>
  );
}
