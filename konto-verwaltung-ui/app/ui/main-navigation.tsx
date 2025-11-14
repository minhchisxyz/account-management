export default function MainNavigation() {
  return (
    <aside className="w-24 bg-white/15 p-4 space-y-4">
      <nav className="space-y-2">
        <a href="#home" className="block rounded px-3 py-2 hover:bg-slate-800">
          Home
        </a>
        <a href="#reports" className="block rounded px-3 py-2 hover:bg-slate-800">
          Reports
        </a>
        <a href="#settings" className="block rounded px-3 py-2 hover:bg-slate-800">
          Settings
        </a>
      </nav>
    </aside>
  )
}
