export default function MealCard({ meal, isDietitian }) {
  return (
    <div className="bg-white p-4 rounded shadow border-l-4 border-primary">
      <h3 className="text-lg font-semibold">{meal.title}</h3>
      <p>{meal.description}</p>
      {isDietitian && meal.notes && <span className="text-sm bg-yellow-200 px-2 py-1 rounded">Clinical Note</span>}
    </div>
  )
}