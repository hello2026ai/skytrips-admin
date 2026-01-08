export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      {/* Date Picker / Quick Actions Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-900 text-base font-bold">Key Metrics</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors">
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
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-50 rounded-lg">
              <span className="material-symbols-outlined text-green-600">payments</span>
            </div>
            <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">+12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-3">Total Revenue</p>
          <p className="text-slate-900 text-2xl font-bold tracking-tight">$124,500</p>
        </div>

        {/* Active Flights */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 rounded-lg">
              <span className="material-symbols-outlined text-blue-600">flight_takeoff</span>
            </div>
            <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">+3%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-3">Active Flights</p>
          <p className="text-slate-900 text-2xl font-bold tracking-tight">42</p>
        </div>

        {/* Ticket Sales */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 rounded-lg">
              <span className="material-symbols-outlined text-purple-600">confirmation_number</span>
            </div>
            <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">+8%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-3">Ticket Sales</p>
          <p className="text-slate-900 text-2xl font-bold tracking-tight">1,240</p>
        </div>

        {/* Customer Satisfaction */}
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 rounded-lg">
              <span className="material-symbols-outlined text-amber-600">sentiment_satisfied</span>
            </div>
            <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">+1%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-3">Customer Satisfaction</p>
          <p className="text-slate-900 text-2xl font-bold tracking-tight">4.8/5</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-slate-900 text-lg font-bold leading-normal">Revenue Analytics</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-slate-900 text-3xl font-bold tracking-tight">$124.5k</p>
                <p className="text-green-700 text-sm font-medium bg-green-50 px-2 py-0.5 rounded">+15% vs last month</p>
              </div>
            </div>
            <div className="text-slate-500 text-sm">Jan 1 - Jan 30</div>
          </div>
          {/* Chart SVG */}
          <div className="w-full h-[250px] mt-4 relative">
            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 478 150" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="revenue-gradient" x1="239" x2="239" y1="0" y2="150">
                  <stop stopColor="#2b8cee" stopOpacity="0.2"></stop>
                  <stop offset="1" stopColor="#2b8cee" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#revenue-gradient)"></path>
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#2b8cee" strokeLinecap="round" strokeWidth="3"></path>
            </svg>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Jan 1</span>
              <span>Jan 7</span>
              <span>Jan 14</span>
              <span>Jan 21</span>
              <span>Jan 30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-slate-900 text-lg font-bold">Recent Bookings</h3>
          <a className="text-sm text-primary font-medium hover:underline" href="#">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Passenger</th>
                <th className="px-6 py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: '#BK-001', name: 'Alice Johnson', route: 'JFK → LHR', date: 'Oct 24, 2023', status: 'Confirmed', statusColor: 'bg-green-100 text-green-800' },
                { id: '#BK-002', name: 'Mark Smith', route: 'LAX → TYO', date: 'Oct 24, 2023', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
                { id: '#BK-003', name: 'Sarah Lee', route: 'DXB → CDG', date: 'Oct 23, 2023', status: 'Confirmed', statusColor: 'bg-green-100 text-green-800' },
                { id: '#BK-004', name: 'John Doe', route: 'SIN → SYD', date: 'Oct 23, 2023', status: 'Cancelled', statusColor: 'bg-red-100 text-red-800' },
                { id: '#BK-005', name: 'Emily Davis', route: 'YYZ → MUC', date: 'Oct 22, 2023', status: 'Confirmed', statusColor: 'bg-green-100 text-green-800' },
              ].map((booking, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{booking.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-8 rounded-full bg-cover bg-center" 
                        style={{ backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(booking.name)}&background=random")` }}
                      ></div>
                      {booking.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{booking.route}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.statusColor}`}>
                      {booking.status}
                    </span>
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
