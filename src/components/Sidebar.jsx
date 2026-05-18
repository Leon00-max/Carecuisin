export default function Sidebar({ role }) {
  const links = {
    patient: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/meal-plan', label: 'Meal Plan' },
    ],
    dietitian: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/create-plan', label: 'Create Plan' },
      { href: '/refer', label: 'Refer' },
    ],
    chef: [
      { href: '/dashboard', label: 'Dashboard' },
    ],
    admin: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/verify-users', label: 'Verify Users' },
      { href: '/complaints', label: 'Complaints' },
    ],
  }
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <ul>
        {links[role].map(link => (
          <li key={link.href} className="mb-2">
            <a href={link.href} className="block p-2 rounded hover:bg-gray-200">{link.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}