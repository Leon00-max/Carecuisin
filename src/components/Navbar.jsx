export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">CareCuisin</h1>
      <div className="flex items-center space-x-4">
        <span>User Avatar</span>
        <button className="bg-secondary px-4 py-2 rounded">Logout</button>
      </div>
    </nav>
  )
}