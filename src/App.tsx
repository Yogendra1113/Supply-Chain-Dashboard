import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { mockDashboardData } from './mockData';
import { calculateMeasures } from './utils/measures';
import { KPICard, SectionHeader, InsightPanel } from './components/DashboardUI';
import { PowerBIEmbed } from './components/PowerBIEmbed';
import { cn } from './lib/utils';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function App() {
  const [activePage, setActivePage] = React.useState(1);
  const [isLiveMode, setIsLiveMode] = React.useState(false);
  const [powerBiUrl, setPowerBiUrl] = React.useState(''); // Paste your URL here
  const measures = calculateMeasures(mockDashboardData);

  const navItems = [
    { id: 1, label: 'Executive Overview', icon: <LayoutDashboard size={18} /> },
    { id: 2, label: 'Inventory & Turnover', icon: <Package size={18} /> },
    { id: 3, label: 'Procurement & Vendors', icon: <Users size={18} /> },
    { id: 4, label: 'Sales & Demand', icon: <TrendingUp size={18} /> },
    { id: 5, label: 'Delivery & Ops', icon: <Truck size={18} /> },
    { id: 6, label: 'Customer Feedback', icon: <MessageSquare size={18} /> },
  ];

  const renderContent = () => {
    if (isLiveMode) {
      return <PowerBIEmbed embedUrl={powerBiUrl} />;
    }

    switch (activePage) {
      case 1: return <ExecutiveOverview measures={measures} />;
      case 2: return <InventoryAnalysis measures={measures} />;
      case 3: return <ProcurementAnalysis measures={measures} />;
      case 4: return <SalesAnalysis measures={measures} />;
      case 5: return <DeliveryAnalysis measures={measures} />;
      case 6: return <FeedbackAnalysis measures={measures} />;
      default: return <ExecutiveOverview measures={measures} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">SupplyChain Pro</h1>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">Analytics Suite v2.4</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                activePage === item.id 
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="glass-card bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase">System Alert</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              3 SKUs are below reorder point. Vendor lead time for 'TechSupply' increased by 12%.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-500">
              {navItems.find(n => n.id === activePage)?.label}
            </h2>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm font-bold text-slate-900">Q2 FY2026 Performance</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg mr-4">
              <button 
                onClick={() => setIsLiveMode(false)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                  !isLiveMode ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Mock Data
              </button>
              <button 
                onClick={() => setIsLiveMode(true)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                  isLiveMode ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Live Power BI
              </button>
            </div>
            <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              <Calendar size={18} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// --- Page Components ---

function ExecutiveOverview({ measures }: { measures: any }) {
  const revenueData = [
    { name: 'Jan', revenue: 45000, target: 40000 },
    { name: 'Feb', revenue: 52000, target: 42000 },
    { name: 'Mar', revenue: 48000, target: 45000 },
    { name: 'Apr', revenue: 61000, target: 48000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="OTIF (On-Time In-Full)" 
          value={`${measures.otifPercentage.toFixed(1)}%`} 
          trend={{ value: 3.4, isPositive: true }}
          icon={<Truck size={20} />}
        />
        <KPICard 
          title="Inventory Turnover" 
          value={measures.inventoryTurnover.toFixed(2)} 
          trend={{ value: 0.4, isPositive: false }}
          icon={<Package size={20} />}
        />
        <KPICard 
          title="Expiry Risk Value" 
          value={`$${(measures.expiredStockValue / 1000).toFixed(1)}k`} 
          trend={{ value: 12.0, isPositive: false }}
          className="border-rose-200"
          icon={<AlertCircle size={20} />}
        />
        <KPICard 
          title="Customer CSAT" 
          value={`${measures.avgCsat.toFixed(1)}/5.0`} 
          trend={{ value: 5.0, isPositive: true }}
          icon={<MessageSquare size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <SectionHeader title="Revenue vs Target" description="Monthly financial performance tracking" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <InsightPanel insights={[
          "OTIF is below 90% due to partial shipments in the FMCG segment (Milk 1L).",
          "Hazardous material storage (HazMat Zone A) is at 92% capacity; risk of overflow.",
          "Expiry risk identified for 'Organic Milk' batch B-4521; 12% of stock expires in 48h.",
          "Recommendation: Implement FEFO (First-Expired, First-Out) for cold storage to reduce waste."
        ]} />
      </div>
    </div>
  );
}

function InventoryAnalysis({ measures }: { measures: any }) {
  const stockData = [
    { category: 'Electronics', stock: 450, value: 120000 },
    { category: 'Furniture', stock: 120, value: 85000 },
    { category: 'Apparel', stock: 800, value: 45000 },
    { category: 'Food', stock: 1200, value: 32000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="DIO (Days Inventory Outstanding)" value={`${measures.dio.toFixed(0)} Days`} subtitle="Target: < 45 Days" />
        <KPICard title="Stock Accuracy" value="99.4%" subtitle="Last Audit: April 1st" />
        <KPICard title="Obsolete Stock Value" value="$12,400" className="border-rose-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <SectionHeader title="Stock Value by Category" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <SectionHeader title="Inventory Health" />
          <div className="space-y-6">
            {[
              { label: 'In-Stock', value: 85, color: 'bg-emerald-500' },
              { label: 'Low Stock', value: 10, color: 'bg-amber-500' },
              { label: 'Out of Stock', value: 5, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Critical Actions</h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                Reorder 'Laptop Pro' - Current stock 12 units (Below reorder point 40)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                Liquidate 'Winter Parka' - 45% overstock vs demand
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcurementAnalysis({ measures }: { measures: any }) {
  const vendorPerformance = [
    { name: 'TechSupply Inc', quality: 98, leadTime: 4, reliability: 95 },
    { name: 'Global Woods', quality: 92, leadTime: 12, reliability: 88 },
    { name: 'SoftFabrics', quality: 95, leadTime: 7, reliability: 92 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Avg Vendor Lead Time" value={`${measures.avgVendorLeadTime.toFixed(1)} Days`} />
        <KPICard title="Cost Variance" value={`${measures.costVariance.toFixed(1)}%`} trend={{ value: 0.8, isPositive: false }} />
        <KPICard title="Active Vendors" value="24" subtitle="3 New vendors onboarded" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <SectionHeader title="Vendor Scorecard" description="Performance metrics across key suppliers" />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Vendor Name</th>
              <th className="px-6 py-4">Quality Score</th>
              <th className="px-6 py-4">Avg Lead Time</th>
              <th className="px-6 py-4">Reliability</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendorPerformance.map((v) => (
              <tr key={v.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{v.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${v.quality}%` }} />
                    </div>
                    <span className="text-xs font-bold">{v.quality}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{v.leadTime} Days</td>
                <td className="px-6 py-4 text-sm text-slate-600">{v.reliability}%</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    v.reliability > 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {v.reliability > 90 ? 'Preferred' : 'Under Review'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightPanel insights={[
        "Global Woods lead time has increased by 4 days due to port congestion.",
        "Cost variance is slightly positive (0.8%) due to raw material price hikes in Asia.",
        "Recommendation: Diversify sourcing for 'Furniture' to mitigate North American logistics risks."
      ]} />
    </div>
  );
}

function SalesAnalysis({ measures }: { measures: any }) {
  const salesTrend = [
    { date: '2026-04-01', sales: 1200, demand: 1350 },
    { date: '2026-04-02', sales: 1500, demand: 1400 },
    { date: '2026-04-03', sales: 1100, demand: 1500 },
    { date: '2026-04-04', sales: 1800, demand: 1700 },
    { date: '2026-04-05', sales: 2100, demand: 2000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Fill Rate" value={`${measures.fillRate.toFixed(1)}%`} subtitle="Target: 95%" />
        <KPICard title="Forecast Accuracy" value="88.2%" trend={{ value: 4.5, isPositive: true }} />
        <KPICard title="Lost Sales Value" value="$8,200" className="border-rose-200" />
      </div>

      <div className="glass-card p-6">
        <SectionHeader title="Actual Sales vs Demand Forecast" />
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} />
              <Line type="monotone" dataKey="demand" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function DeliveryAnalysis({ measures }: { measures: any }) {
  const deliveryStatus = [
    { name: 'On Time', value: 85 },
    { name: 'Delayed < 24h', value: 10 },
    { name: 'Delayed > 24h', value: 5 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Avg Delivery Time" value="2.4 Days" />
        <KPICard title="Carrier Performance" value="94.1%" subtitle="FedEx / UPS / DHL" />
        <KPICard title="Freight Cost / Unit" value="$1.45" trend={{ value: 12, isPositive: false }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <SectionHeader title="Delivery Reliability" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <SectionHeader title="Regional Performance" />
          <div className="space-y-4">
            {[
              { region: 'North America', otd: 98, volume: '4.2k' },
              { region: 'Europe', otd: 94, volume: '2.8k' },
              { region: 'Asia Pacific', otd: 89, volume: '5.1k' },
            ].map((r) => (
              <div key={r.region} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">{r.region}</h4>
                  <p className="text-xs text-slate-500">Volume: {r.volume} units</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-600">{r.otd}%</div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">OTD Target Met</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackAnalysis({ measures }: { measures: any }) {
  const feedbackTrends = [
    { month: 'Jan', score: 4.2 },
    { month: 'Feb', score: 4.1 },
    { month: 'Mar', score: 4.5 },
    { month: 'Apr', score: 4.7 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Avg CSAT Score" value={`${measures.avgCsat.toFixed(1)} / 5.0`} />
        <KPICard title="Issue Resolution Time" value="14.2h" trend={{ value: 15, isPositive: true }} />
        <KPICard title="Return Rate" value="2.1%" subtitle="Target: < 3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <SectionHeader title="CSAT Trend" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedbackTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <SectionHeader title="Top Feedback Themes" />
          <div className="space-y-6">
            {[
              { theme: 'Fast Shipping', count: 142, sentiment: 'positive' },
              { theme: 'Product Quality', count: 98, sentiment: 'positive' },
              { theme: 'Packaging Damage', count: 24, sentiment: 'negative' },
              { theme: 'App Interface', count: 18, sentiment: 'neutral' },
            ].map((t) => (
              <div key={t.theme} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    t.sentiment === 'positive' ? "bg-emerald-500" : 
                    t.sentiment === 'negative' ? "bg-rose-500" : "bg-slate-400"
                  )} />
                  <span className="text-sm font-medium text-slate-700">{t.theme}</span>
                </div>
                <span className="text-xs font-bold text-slate-400">{t.count} mentions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
