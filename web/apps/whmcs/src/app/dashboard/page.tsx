"use client";

import { useState } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Hourly data matching the WHMCS screenshot chart (12am-5pm)
const HOURLY_DATA = [
  { time: "12am", orders: 4.5, income: 22 },
  { time: "1am", orders: 3.5, income: 20 },
  { time: "2am", orders: 3, income: 19 },
  { time: "3am", orders: 3.8, income: 21 },
  { time: "4am", orders: 2, income: 18 },
  { time: "5am", orders: 3, income: 22 },
  { time: "6am", orders: 2.5, income: 20 },
  { time: "7am", orders: 2, income: 19 },
  { time: "8am", orders: 1.5, income: 17 },
  { time: "9am", orders: 2, income: 20 },
  { time: "10am", orders: 2.5, income: 22 },
  { time: "11am", orders: 3, income: 21 },
  { time: "12pm", orders: 2, income: 20 },
  { time: "1pm", orders: 2.5, income: 23 },
  { time: "2pm", orders: 3, income: 25 },
  { time: "3pm", orders: 4, income: 27 },
  { time: "4pm", orders: 3.5, income: 25 },
  { time: "5pm", orders: 3, income: 22 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"today" | "month" | "year">("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Utility bar */}
      <div className="whmcs-utilbar">
        <div className="whmcs-utilbar-inner">
          <div className="whmcs-utilbar-links">
            <a href="#">Home</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">Client Area</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">My Notes</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">My Account</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">Logout</a>
          </div>
          <div className="whmcs-utilbar-date">Monday, 24 July 2017, 17:22</div>
        </div>
      </div>

      {/* WHMCS Admin Navbar */}
      <nav className="whmcs-topnav">
        <div className="whmcs-topnav-inner">
          <a href="/" className="whmcs-topnav-logo">
            <img src="/images/logos/whmcs-co-brand-logo.svg" alt="WHMCS" style={{ height: 32, filter: "brightness(10)" }} />
          </a>
          <div className="whmcs-topnav-alerts">
            <span className="whmcs-alert-item whmcs-alert-orange">3 Pending Orders</span>
            <span className="whmcs-alert-sep">|</span>
            <span className="whmcs-alert-item whmcs-alert-red">73 Overdue Invoices</span>
            <span className="whmcs-alert-sep">|</span>
            <span className="whmcs-alert-item whmcs-alert-blue">17 Ticket(s) Awaiting Reply</span>
          </div>
          <div className="whmcs-topnav-search">
            <input type="text" placeholder="" className="whmcs-search-input" />
            <button className="whmcs-search-btn">&#x1F50D;</button>
          </div>
        </div>
        <div className="whmcs-nav-tabs">
          {["Clients", "Orders", "Billing", "Support", "Reports", "Utilities", "Addons", "Setup", "Help"].map(item => (
            <button key={item} className="whmcs-nav-tab">{item}</button>
          ))}
        </div>
      </nav>

      {/* Open Sidebar tab */}
      <button
        className={`sidebar-toggle-tab ${sidebarOpen ? "sidebar-toggle-open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <aside className="admin-sidebar admin-sidebar-floating">
          <div className="admin-sidebar-section">
            <h4>Shortcuts</h4>
            <ul>
              <li><a href="#">Add New Client</a></li>
              <li><a href="#">Add New Order</a></li>
              <li><a href="#">Create Invoice</a></li>
              <li><a href="#">Generate Invoices</a></li>
              <li><a href="#">Open New Ticket</a></li>
              <li><a href="#">Domain Lookup</a></li>
              <li><a href="#">WHM Import</a></li>
              <li><a href="#">Income Report</a></li>
            </ul>
          </div>
          <div className="admin-sidebar-section">
            <h4>System Info</h4>
            <div className="sysinfo">
              <div>WHMCS: 7.2.2</div>
              <div>PHP: 7.1.6</div>
              <div>MySQL: 5.7.18</div>
              <div>IP: 192.168.1.1</div>
            </div>
          </div>
          <div className="admin-sidebar-section">
            <h4>Staff Online</h4>
            <div className="staff-online">admin</div>
          </div>
        </aside>
      )}

      <div className="admin-page">
        {/* Dashboard header */}
        <div className="admin-main-header">
          <h1>Dashboard</h1>
          <button className="admin-settings-icon">&#x2699;</button>
        </div>

        {/* Stat cards row */}
        <div className="admin-stat-cards">
          <div className="admin-stat-card admin-stat-green">
            <div className="admin-stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <div className="admin-stat-card-info">
              <div className="admin-stat-card-num">3</div>
              <div className="admin-stat-card-label">Pending Orders</div>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-pink">
            <div className="admin-stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="admin-stat-card-info">
              <div className="admin-stat-card-num">17</div>
              <div className="admin-stat-card-label">Tickets Waiting</div>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-red">
            <div className="admin-stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
            </div>
            <div className="admin-stat-card-info">
              <div className="admin-stat-card-num">0</div>
              <div className="admin-stat-card-label">Pending Cancellations</div>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-blue">
            <div className="admin-stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="admin-stat-card-info">
              <div className="admin-stat-card-num">3</div>
              <div className="admin-stat-card-label">Pending Module Actions</div>
            </div>
          </div>
        </div>

        {/* Main content grid: System Overview + Automation Overview */}
        <div className="admin-content-grid">
          {/* System Overview */}
          <div className="admin-widget admin-widget-large">
            <div className="admin-widget-header">
              <span>System Overview</span>
              <div className="admin-widget-actions">
                <button title="Toggle">&#128065;</button>
                <button title="Collapse">&#x25B2;</button>
              </div>
            </div>
            <div className="admin-widget-body">
              <div className="chart-tabs">
                <button className={activeTab === "today" ? "chart-tab-active" : ""} onClick={() => setActiveTab("today")}>Today</button>
                <button className={activeTab === "month" ? "chart-tab-active" : ""} onClick={() => setActiveTab("month")}>This Month</button>
                <button className={activeTab === "year" ? "chart-tab-active" : ""} onClick={() => setActiveTab("year")}>This Year</button>
              </div>
              <div className="chart-legend">
                <span><span className="legend-box legend-gray" /> New Orders</span>
                <span><span className="legend-box legend-green" /> Income</span>
              </div>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={HOURLY_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={{ stroke: "#ddd" }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={{ stroke: "#ddd" }}
                      tickLine={false}
                      allowDecimals={false}
                      label={{ value: "New Orders", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#888" }, offset: 0 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={{ stroke: "#ddd" }}
                      tickLine={false}
                      label={{ value: "Income", angle: 90, position: "insideRight", style: { fontSize: 11, fill: "#888" }, offset: 0 }}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid #ddd", background: "#fff" }}
                      formatter={(value, name) => {
                        if (name === "income") return [`$${Number(value).toLocaleString()}`, "Income"];
                        return [value, "New Orders"];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
                      formatter={(value: string) => value === "orders" ? "New Orders" : "Income"}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="orders"
                      fill="rgba(200,200,200,0.3)"
                      stroke="#ccc"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#fff", stroke: "#ccc", strokeWidth: 2 }}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="income"
                      fill="rgba(122,182,72,0.25)"
                      stroke="#7ab648"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#fff", stroke: "#7ab648", strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: "#7ab648" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Automation Overview */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <span>Automation Overview</span>
              <div className="admin-widget-actions">
                <button>&#128065;</button>
                <button>&#x1F4DD;</button>
                <button>&#x25B2;</button>
              </div>
            </div>
            <div className="admin-widget-body">
              <div className="automation-grid-v2">
                <div className="automation-card">
                  <svg viewBox="0 0 120 40" className="automation-mini-chart">
                    <polyline points="0,35 20,25 40,30 60,15 80,20 100,8 120,12" fill="none" stroke="#3c8dbc" strokeWidth="2"/>
                  </svg>
                  <div className="automation-card-label">Invoices Created</div>
                  <div className="automation-card-val" style={{ color: "#3c8dbc" }}>3</div>
                </div>
                <div className="automation-card">
                  <svg viewBox="0 0 120 40" className="automation-mini-chart">
                    <polyline points="0,30 20,20 40,25 60,10 80,15 100,5 120,8" fill="none" stroke="#00a65a" strokeWidth="2"/>
                  </svg>
                  <div className="automation-card-label">Credit Card Captures</div>
                  <div className="automation-card-val" style={{ color: "#00a65a" }}>2</div>
                </div>
                <div className="automation-card">
                  <svg viewBox="0 0 120 40" className="automation-mini-chart">
                    <polyline points="0,20 30,25 60,15 90,30 120,20" fill="none" stroke="#f39c12" strokeWidth="2"/>
                    <polyline points="0,25 30,20 60,30 90,15 120,25" fill="none" stroke="#f39c12" strokeWidth="2" strokeDasharray="4"/>
                  </svg>
                  <div className="automation-card-label">Overdue Suspensions</div>
                  <div className="automation-card-val" style={{ color: "#f39c12" }}>0</div>
                </div>
                <div className="automation-card">
                  <svg viewBox="0 0 120 40" className="automation-mini-chart">
                    <polyline points="0,30 20,35 40,28 60,32 80,25 100,30 120,28" fill="none" stroke="#dd4b39" strokeWidth="2"/>
                  </svg>
                  <div className="automation-card-label">Inactive Tickets Closed</div>
                  <div className="automation-card-val" style={{ color: "#dd4b39" }}>3</div>
                </div>
                <div className="automation-card">
                  <svg viewBox="0 0 120 40" className="automation-mini-chart">
                    <rect x="10" y="15" width="15" height="20" fill="rgba(128,0,128,0.3)" rx="2"/>
                    <rect x="30" y="8" width="15" height="27" fill="rgba(128,0,128,0.4)" rx="2"/>
                    <rect x="50" y="12" width="15" height="23" fill="rgba(128,0,128,0.35)" rx="2"/>
                    <rect x="70" y="5" width="15" height="30" fill="rgba(128,0,128,0.4)" rx="2"/>
                    <rect x="90" y="10" width="15" height="25" fill="rgba(128,0,128,0.45)" rx="2"/>
                  </svg>
                  <div className="automation-card-label">Overdue Reminders</div>
                  <div className="automation-card-val" style={{ color: "#800080" }}>4</div>
                </div>
                <div className="automation-card">
                  <svg viewBox="0 0 120 40" className="automation-mini-chart">
                    <polyline points="0,25 30,20 60,15 90,10 120,5" fill="none" stroke="#3c8dbc" strokeWidth="2"/>
                  </svg>
                  <div className="automation-card-label">Cancellations Processed</div>
                  <div className="automation-card-val" style={{ color: "#3c8dbc" }}>0</div>
                </div>
              </div>
              <div className="automation-footer">
                <span>&#x2699;</span> Last Automation Run: <strong>Never</strong> <span className="automation-attention">NEEDS ATTENTION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: 3 columns */}
        <div className="admin-bottom-grid-3">
          {/* Left column */}
          <div className="admin-widget-stack">
            {/* Billing */}
            <div className="admin-widget">
              <div className="admin-widget-header">
                <span>Billing</span>
                <div className="admin-widget-actions">
                  <button>&#128065;</button>
                  <button>&#x1F4DD;</button>
                  <button>&#x25B2;</button>
                </div>
              </div>
              <div className="admin-widget-body">
                <div className="billing-grid-v2">
                  <div className="billing-item-v2">
                    <div className="billing-amount-v2" style={{ color: "#00a65a" }}>$18.95</div>
                    <div className="billing-label-v2">Today</div>
                  </div>
                  <div className="billing-item-v2">
                    <div className="billing-amount-v2" style={{ color: "#3c8dbc" }}>$279.32</div>
                    <div className="billing-label-v2">This Month</div>
                  </div>
                  <div className="billing-item-v2">
                    <div className="billing-amount-v2" style={{ color: "#00a65a" }}>$6,432.88</div>
                    <div className="billing-label-v2">This Year</div>
                  </div>
                  <div className="billing-item-v2">
                    <div className="billing-amount-v2" style={{ color: "#dd4b39" }}>$32,317.94</div>
                    <div className="billing-label-v2">All Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="admin-widget">
              <div className="admin-widget-header">
                <span>System Health</span>
                <div className="admin-widget-actions">
                  <button>&#128065;</button>
                  <button>&#x1F4DD;</button>
                  <button>&#x25B2;</button>
                </div>
              </div>
              <div className="admin-widget-body">
                <div className="system-health">
                  <div className="system-health-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00a65a" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <span className="system-health-label">Overall Rating</span>
                  <button className="system-health-btn">&#x25B6; View Issues</button>
                </div>
                <div className="system-health-result" style={{ color: "#00a65a", fontWeight: 700, fontSize: 20, marginTop: 10 }}>Good</div>
              </div>
            </div>
          </div>

          {/* Middle column */}
          <div className="admin-widget-stack">
            {/* To-Do List */}
            <div className="admin-widget">
              <div className="admin-widget-header">
                <span>To-Do List</span>
                <div className="admin-widget-actions">
                  <button>&#128065;</button>
                  <button>&#x1F4DD;</button>
                  <button>&#x25B2;</button>
                </div>
              </div>
              <div className="admin-widget-body todo-body">
                <div className="todo-item">
                  <input type="checkbox" className="todo-check" readOnly />
                  <div className="todo-content">
                    <span>Update social header</span>
                    <span className="todo-badge todo-badge-progress">IN PROGRESS</span>
                    <span className="todo-lock">&#x1F512;</span>
                  </div>
                  <span className="todo-due">Due in 1 day</span>
                </div>
                <div className="todo-item">
                  <input type="checkbox" className="todo-check" readOnly />
                  <div className="todo-content">
                    <span>Migrate customer domain</span>
                    <span className="todo-badge todo-badge-new">NEW</span>
                    <span className="todo-lock">&#x1F512;</span>
                  </div>
                  <span className="todo-due">Due 1 week ago</span>
                </div>
                <div className="todo-item">
                  <input type="checkbox" className="todo-check" readOnly />
                  <div className="todo-content">
                    <span>Domain Transfer Failure</span>
                    <span className="todo-badge todo-badge-pending">PENDING</span>
                    <span className="todo-lock">&#x1F512;</span>
                  </div>
                  <span className="todo-due">Due Never</span>
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="admin-widget">
              <div className="admin-widget-header">
                <span>Network Status</span>
                <div className="admin-widget-actions">
                  <button>&#128065;</button>
                  <button>&#x25B2;</button>
                </div>
              </div>
              <div className="admin-widget-body">
                <table className="network-table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="network-server-name">Jupiter</div>
                        <div className="network-server-host">jupiter.serverfarm...</div>
                      </td>
                      <td><span className="network-status-offline">Offline</span></td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td style={{ fontSize: 11, color: "#888" }}>Status</td>
                      <td style={{ fontSize: 11, color: "#888" }}>Uptime</td>
                      <td style={{ fontSize: 11, color: "#888" }}>Avg. load</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="admin-widget-stack">
            {/* Support */}
            <div className="admin-widget">
              <div className="admin-widget-header">
                <span>Support</span>
                <div className="admin-widget-actions">
                  <button>&#128065;</button>
                  <button>&#x1F4DD;</button>
                  <button>&#x25B2;</button>
                </div>
              </div>
              <div className="admin-widget-body support-body">
                <div className="support-stats">
                  <div className="support-stat">
                    <div className="support-stat-icon support-stat-teal">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(45 12 12)"/>
                      </svg>
                    </div>
                    <div>
                      <div className="support-stat-label">Awaiting Reply</div>
                      <div className="support-stat-num" style={{ color: "#3c8dbc" }}>17 Tickets</div>
                    </div>
                  </div>
                  <div className="support-stat">
                    <div className="support-stat-icon support-stat-red">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div>
                      <div className="support-stat-label">Assigned To You</div>
                      <div className="support-stat-num" style={{ color: "#dd4b39" }}>3 Tickets</div>
                    </div>
                  </div>
                </div>
                <div className="support-tickets">
                  <div className="support-ticket">
                    <a href="#">#832465 - Website down</a>
                    <span className="support-ticket-time">27 minutes ago</span>
                  </div>
                  <div className="support-ticket">
                    <a href="#">#671840 - Re: URGENT: Low balance in your WH...</a>
                    <span className="support-ticket-time">6 hours ago</span>
                  </div>
                  <div className="support-ticket">
                    <a href="#">#450342 - Fwd: Payment to add funds to Reselle...</a>
                    <span className="support-ticket-time">20 hours ago</span>
                  </div>
                  <div className="support-ticket">
                    <a href="#">#686238 - Unable to connect to ftp</a>
                    <span className="support-ticket-time">2 days ago</span>
                  </div>
                  <div className="support-ticket">
                    <a href="#">#474247 - [Ticket ID: 224546] Order Status (#2618...</a>
                    <span className="support-ticket-time">1 week ago</span>
                  </div>
                </div>
                <div className="support-footer-links">
                  <a href="#">View All Tickets</a>
                  <a href="#">View My Tickets</a>
                  <a href="#">Open New Ticket</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
