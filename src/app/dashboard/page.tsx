export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      {/* Date Picker / Quick Actions Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold">Key Metrics</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span>Last 30 Days</span>
            <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
          </button>
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:bg-blue-600 transition-colors">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Flight</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">payments</span>
            </div>
            <span className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs font-bold">+12%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3">Total Revenue</p>
          <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">$124,500</p>
        </div>

        {/* Active Flights */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">flight_takeoff</span>
            </div>
            <span className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs font-bold">+3%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3">Active Flights</p>
          <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">42</p>
        </div>

        {/* Ticket Sales */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">confirmation_number</span>
            </div>
            <span className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs font-bold">+8%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3">Ticket Sales</p>
          <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">1,240</p>
        </div>

        {/* Customer Satisfaction */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">sentiment_satisfied</span>
            </div>
            <span className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs font-bold">+1%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3">Customer Satisfaction</p>
          <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">4.8/5</p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-foreground text-lg font-bold">Recent Bookings</h3>
          <a className="text-sm text-primary font-medium hover:underline" href="#">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wider">Passenger</th>
                <th className="px-6 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: '#BK-001', name: 'Alice Johnson', route: 'JFK → LHR', date: 'Oct 24, 2023', status: 'Confirmed', statusColor: 'bg-success/20 text-success' },
                { id: '#BK-002', name: 'Mark Smith', route: 'LAX → TYO', date: 'Oct 24, 2023', status: 'Pending', statusColor: 'bg-warning/20 text-warning' },
                { id: '#BK-003', name: 'Sarah Lee', route: 'DXB → CDG', date: 'Oct 23, 2023', status: 'Confirmed', statusColor: 'bg-success/20 text-success' },
                { id: '#BK-004', name: 'John Doe', route: 'SIN → SYD', date: 'Oct 23, 2023', status: 'Cancelled', statusColor: 'bg-destructive/20 text-destructive' },
                { id: '#BK-005', name: 'Emily Davis', route: 'YYZ → MUC', date: 'Oct 22, 2023', status: 'Confirmed', statusColor: 'bg-success/20 text-success' },
              ].map((booking, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{booking.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-8 rounded-full bg-cover bg-center" 
                        style={{ backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(booking.name)}&background=random")` }}
                      ></div>
                      {booking.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{booking.route}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                      aria-label={`View details for booking ${booking.id}`}
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
