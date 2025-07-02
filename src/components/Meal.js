import React from 'react';

// তারিখ সুন্দরভাবে দেখানোর জন্য helper
const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Meal({ members, meals }) {
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
            {sortedMeals.map(meal => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.date}>
                <div className="border rounded-4 shadow-sm p-3 bg-white h-100">
                  <div className="fw-bold text-primary mb-2">{formatDate(meal.date)}</div>
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
