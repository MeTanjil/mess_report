import React from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// বাংলা মাসের পূর্ণ নামের array
const banglaMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// তারিখ সুন্দরভাবে দেখানোর জন্য কাস্টম helper
const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = banglaMonths[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};

export default function Meal({ members, meals, onEdit, onDelete }) {
  // শুধুমাত্র যেসব তারিখে meal আছে, ফিল্টার করুন
  const filteredMeals = meals.filter(meal =>
    members.some(m =>
      Number(meal.meals?.[m]?.breakfast || 0) > 0 ||
      Number(meal.meals?.[m]?.lunch || 0) > 0 ||
      Number(meal.meals?.[m]?.dinner || 0) > 0
    )
  );

  // তারিখ অনুসারে sort করুন (oldest first)
  const sortedMeals = [...filteredMeals].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Meal ডিলিট কনফার্মেশন Popup
  const handleDelete = idx => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: `এই তারিখের Meal ডিলিট করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
      cancelButtonText: 'বাতিল'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete && onDelete(idx);
        Swal.fire({
          icon: 'success',
          title: 'ডিলিট সম্পন্ন!',
          text: 'Meal ডিলিট করা হয়েছে।',
          timer: 1300,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <section className="mb-4">
      <h4 className="fw-bold text-success fs-4 mb-4">
        🥣 শুধু Meal হিসাব (তারিখ অনুক্রমে)
      </h4>
      <div className="mb-4">
        {sortedMeals.length === 0 ? (
          <div className="text-secondary border rounded-4 text-center p-4">
            কোনো meal data নেই
          </div>
        ) : (
          <div className="row g-3">
            {sortedMeals.map((meal, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.date}>
                <div className="border rounded-4 shadow-sm p-3 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-primary">{formatDate(meal.date)}</span>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-success me-1"
                        onClick={() => onEdit && onEdit(meals.findIndex(m => m.date === meal.date))}
                        title="Edit Meal"
                      >
                        ✎
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(meals.findIndex(m => m.date === meal.date))}
                        title="Delete Meal"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm align-middle m-0 text-center">
                      <thead>
                        <tr className="table-success">
                          <th>নাম</th>
                          <th>সকাল</th>
                          <th>দুপুর</th>
                          <th>রাত</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map(m => (
                          <tr key={m}>
                            <td className="fw-bold">{m}</td>
                            <td>{meal.meals?.[m]?.breakfast ?? 0}</td>
                            <td>{meal.meals?.[m]?.lunch ?? 0}</td>
                            <td>{meal.meals?.[m]?.dinner ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
