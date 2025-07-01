import React from 'react';

export default function Meal({ members, meals }) {
  // date-wise sort (oldest first)
  const sortedMeals = [...meals].sort((a, b) => new Date(a.date) - new Date(b.date));

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
              <div className="col-12 col-md-6 col-lg-4" key={idx}>
                <div className="border rounded-4 shadow-sm p-3 bg-white h-100">
                  <div className="fw-bold text-primary mb-2">{meal.date}</div>
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
