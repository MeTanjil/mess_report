import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const CATEGORIES = [
  { value: "basha", label: "বাড়ি ভাড়া" },
  { value: "gas", label: "গ্যাস বিল (সবার মাঝে ভাগ হবে)" },
  { value: "utility", label: "ইউটিলিটি (বিদ্যুৎ/পানি, সবার মাঝে ভাগ হবে)" },
  { value: "internet", label: "ইন্টারনেট (সবার মাঝে ভাগ হবে)" },
  { value: "bazar", label: "বাজার" },
  { value: "khala", label: "খালা/কুক" },
  { value: "extra", label: "এক্সট্রা খরচ (সবার মাঝে ভাগ হবে)" },
];

export default function ExpenseEntry({
  expenses = [],
  members = [],
  addExpense,
  editExpense,
  deleteExpense,
}) {
  // "সবাই"-কে option হিসেবে রাখি
  const memberOptions = [{ value: "all", label: "সবাই" }, ...members.map(m => ({ value: m, label: m }))];

  // State variables
  const [member, setMember] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editMember, setEditMember] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Add or Edit Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !date || !category) return;

    // "সবাই"-কে ভাগ করে addExpense call
    if (category === "gas" || category === "utility" || category === "internet" || category === "extra" || member === "all") {
      const dividedAmount = (parseFloat(amount) / members.length).toFixed(2);
      members.forEach(m => {
        addExpense({
          member: m,
          amount: parseFloat(dividedAmount),
          date,
          category,
          description: category === "extra" ? description : "",
        });
      });
      toast.success("✅ সবার মাঝে খরচ ভাগ হয়েছে!", { position: "top-center" });
    } else if (member && member !== "all") {
      addExpense({
        member,
        amount: parseFloat(amount),
        date,
        category,
        description: category === "extra" ? description : "",
      });
      toast.success("✅ খরচ যোগ হয়েছে!", { position: "top-center" });
    }

    setMember("");
    setAmount("");
    setDate("");
    setCategory("");
    setDescription("");
    setEditIdx(null);
  };

  // Edit Button Click
  const handleEdit = (idx) => {
    const ex = expenses[idx];
    setEditIdx(idx);
    setEditMember(ex.member);
    setEditAmount(ex.amount);
    setEditDate(ex.date);
    setEditCategory(ex.category);
    setEditDescription(ex.description || "");
  };

  // Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editAmount || !editDate || !editCategory) return;

    editExpense(editIdx, {
      member: editMember,
      amount: parseFloat(editAmount),
      date: editDate,
      category: editCategory,
      description: editCategory === "extra" ? editDescription : "",
    });
    toast.success("✏️ খরচ এডিট হয়েছে!", { position: "top-center" });
    setEditIdx(null);
    setEditMember("");
    setEditAmount("");
    setEditDate("");
    setEditCategory("");
    setEditDescription("");
  };

  // Delete Confirmation with SweetAlert2
  const handleDelete = (idx) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "ডিলিট করলে আর ফেরত আসবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExpense(idx);
        toast.error("❌ খরচ ডিলিট হয়েছে!", { position: "top-center" });
      }
    });
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditIdx(null);
    setEditMember("");
    setEditAmount("");
    setEditDate("");
    setEditCategory("");
    setEditDescription("");
  };

  return (
    <section className="mb-4">
      <h4 className="fw-bold text-success mb-3 fs-4 border-bottom pb-2">
        💵 খরচের হিসাব
      </h4>

      {/* List */}
      <div className="mb-3">
        {expenses.length === 0 ? (
          <div className="text-secondary text-center p-2">
            এখনও কোনো খরচ যোগ হয়নি
          </div>
        ) : (
          <ul className="list-group">
            {expenses.map((ex, idx) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
                {editIdx === idx ? (
                  <form className="d-flex gap-2 w-100" onSubmit={handleEditSubmit}>
                    <select
                      className="form-control"
                      value={editMember}
                      onChange={e => setEditMember(e.target.value)}
                      required
                    >
                      {memberOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <select
                      className="form-control"
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      required
                    >
                      <option value="">ক্যাটাগরি</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {(editCategory === "extra") && (
                      <input
                        className="form-control"
                        type="text"
                        placeholder="এক্সট্রা খরচের বিবরণ"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        required
                      />
                    )}
                    <input
                      className="form-control"
                      type="number"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                    <input
                      className="form-control"
                      type="date"
                      value={editDate}
                      onChange={e => setEditDate(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-success btn-sm">সেভ</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>বাতিল</button>
                  </form>
                ) : (
                  <>
                    <span>
                      <b>{ex.member}</b> — <span>{ex.amount}৳</span> — <span>{ex.date}</span>
                      <span className="badge bg-info ms-2">{CATEGORIES.find(c => c.value === ex.category)?.label}</span>
                      {ex.description && <span className="text-muted ms-2">({ex.description})</span>}
                    </span>
                    <span>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(idx)}>এডিট</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(idx)}>ডিলিট</button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Form */}
      {editIdx === null && (
        <form className="d-flex gap-2" onSubmit={handleSubmit}>
          <select
            className="form-control"
            value={member}
            onChange={e => setMember(e.target.value)}
            required={!(category === "gas" || category === "utility" || category === "internet" || category === "extra")}
            disabled={category === "gas" || category === "utility" || category === "internet" || category === "extra"}
          >
            <option value="">সদস্য নির্বাচন করুন</option>
            {memberOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="form-control"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">ক্যাটাগরি</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {(category === "extra") && (
            <input
              className="form-control"
              type="text"
              placeholder="এক্সট্রা খরচের বিবরণ"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          )}
          <input
            className="form-control"
            type="number"
            placeholder="খরচ (৳)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <input
            className="form-control"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">অ্যাড</button>
        </form>
      )}
    </section>
  );
}
