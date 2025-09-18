export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-primary">
                MiCuba LMS
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Dashboard</span>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
