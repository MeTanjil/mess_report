import React, { useState } from 'react';

export default function MemberList({ members, addMember, deleteMember, editMember }) {
  const [name, setName] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');

  // ফর্ম সাবমিট — Add অথবা Edit
  const handleSubmit = e => {
    e.preventDefault();
    if (editIndex === null) {
      if (name.trim()) {
        addMember(name.trim());
        setName('');
      }
    } else {
      if (editName.trim()) {
        editMember(editIndex, editName.trim());
        setEditIndex(null);
        setEditName('');
      }
    }
  };

  // Edit বাটনে চাপলে
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditName(members[index]);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditName('');
  };

  return (
    <section className="mb-4">
      <h4 className="fw-semibold mb-3">🧑‍🤝‍🧑 মেম্বার লিস্ট</h4>
      <ul className="list-group mb-3">
        {members.map((m, i) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
            {editIndex === i ? (
              <form className="d-flex gap-2 w-100" onSubmit={handleSubmit}>
                <input
                  className="form-control"
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-success btn-sm">সেভ</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>বাতিল</button>
              </form>
            ) : (
              <>
                <span>{m}</span>
                <span>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(i)}>এডিট</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteMember(i)}>ডিলিট</button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
      {editIndex === null && (
        <form className="d-flex gap-2" onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="text"
            placeholder="নতুন মেম্বার নাম"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success">অ্যাড</button>
        </form>
      )}
    </section>
  );
}
