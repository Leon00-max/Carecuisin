export default function ReferralCard({ referral, onMarkPrepared }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{referral.patientName}</h3>
      <p>Dietitian: {referral.dietitianName}</p>
      <p>Plan: {referral.planSummary}</p>
      <span className={`px-2 py-1 rounded text-sm ${referral.status === 'Prepared' ? 'bg-green-200' : 'bg-yellow-200'}`}>{referral.status}</span>
      {referral.status !== 'Prepared' && <button onClick={() => onMarkPrepared(referral.id)} className="bg-secondary text-white px-4 py-2 rounded mt-2">Mark as Prepared</button>}
    </div>
  )
}