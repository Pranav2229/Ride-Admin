
import React, { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  CarFront,
  IndianRupee,
  Download,
  Search,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  FileText,
} from "lucide-react";
import "../styles/ReportsPage.css";

const initialTransactions = [
  { id: "RB2401", driver: "Ramesh Patel", date: "2026-10-13", fare: 450, commission: 15, payment: "Paid", method: "UPI" },
  { id: "RB2402", driver: "Suresh Kumar", date: "2026-10-13", fare: 320, commission: 15, payment: "Paid", method: "Cash" },
  { id: "RB2403", driver: "Vikram Singh", date: "2026-10-12", fare: 680, commission: 15, payment: "Pending", method: "Card" },
  { id: "RB2404", driver: "Arun Kumar", date: "2026-10-12", fare: 250, commission: 15, payment: "Paid", method: "UPI" },
  { id: "RB2405", driver: "Santosh Yadav", date: "2026-10-11", fare: 520, commission: 15, payment: "Failed", method: "UPI" },
  { id: "RB2406", driver: "Mahesh Pawar", date: "2026-10-10", fare: 390, commission: 15, payment: "Paid", method: "Cash" },
  { id: "RB2407", driver: "Amit Desai", date: "2026-10-09", fare: 760, commission: 15, payment: "Paid", method: "Card" },
  { id: "RB2408", driver: "Pooja Sharma", date: "2026-10-08", fare: 410, commission: 15, payment: "Pending", method: "UPI" },
];

const monthlyRevenue = [
  { month: "May", revenue: 18500 },
  { month: "Jun", revenue: 22800 },
  { month: "Jul", revenue: 21400 },
  { month: "Aug", revenue: 28700 },
  { month: "Sep", revenue: 26300 },
  { month: "Oct", revenue: 32400 },
];

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function ReportsPage() {
  const [transactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(term) ||
        item.driver.toLowerCase().includes(term) ||
        item.method.toLowerCase().includes(term);

      const matchesStatus =
        paymentFilter === "All Status" || item.payment === paymentFilter;

      const matchesStart = !startDate || item.date >= startDate;
      const matchesEnd = !endDate || item.date <= endDate;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [transactions, search, paymentFilter, startDate, endDate]);

  const paidTransactions = transactions.filter((item) => item.payment === "Paid");
  const totalRevenue = paidTransactions.reduce((sum, item) => sum + item.fare, 0);
  const commissionEarned = paidTransactions.reduce(
    (sum, item) => sum + item.commission,
    0
  );
  const totalRides = transactions.length;
  const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue));

  const resetFilters = () => {
    setSearch("");
    setPaymentFilter("All Status");
    setStartDate("");
    setEndDate("");
  };

  const exportCSV = () => {
    const headers = [
      "Ride ID",
      "Driver",
      "Date",
      "Fare (INR)",
      "Commission (INR)",
      "Payment Status",
      "Payment Method",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.driver,
      item.date,
      item.fare,
      item.commission,
      item.payment,
      item.method,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ridebuddy-revenue-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <span className="reports-eyebrow">FINANCE & ANALYTICS</span>
          <h1>Revenue &amp; Reports</h1>
          <p>Track ride revenue, platform commission and payment activity.</p>
        </div>
        <button className="reports-export-button" onClick={exportCSV}>
          <Download size={16} />
          Export CSV
        </button>
      </header>

      <section className="reports-summary">
        <article className="report-stat-card">
          <div className="report-stat-icon report-yellow">
            <Wallet size={21} />
          </div>
          <div className="report-stat-content">
            <span>Total Revenue Collected</span>
            <strong>{currency(totalRevenue)}</strong>
            <small className="report-positive">
              <ArrowUpRight size={14} /> Demo totals
            </small>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon report-green">
            <TrendingUp size={21} />
          </div>
          <div className="report-stat-content">
            <span>Platform Commission</span>
            <strong>{currency(commissionEarned)}</strong>
            <small className="report-positive">
              <ArrowUpRight size={14} /> ₹15 per paid ride
            </small>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon report-blue">
            <CarFront size={21} />
          </div>
          <div className="report-stat-content">
            <span>Total Recorded Rides</span>
            <strong>{totalRides}</strong>
            <small className="report-neutral">Sample transactions</small>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon report-purple">
            <IndianRupee size={21} />
          </div>
          <div className="report-stat-content">
            <span>Average Paid Fare</span>
            <strong>
              {currency(
                paidTransactions.length
                  ? Math.round(totalRevenue / paidTransactions.length)
                  : 0
              )}
            </strong>
            <small className="report-neutral">Per paid ride</small>
          </div>
        </article>
      </section>

      <section className="reports-chart-card">
        <div className="reports-section-heading">
          <div>
            <h2>Revenue Overview</h2>
            <p>Monthly revenue trend across the platform</p>
          </div>
          <span className="reports-chart-label">
            <span /> Revenue (₹)
          </span>
        </div>

        <div className="reports-chart">
          <div className="reports-chart-axis">
            <span>₹35k</span>
            <span>₹25k</span>
            <span>₹15k</span>
            <span>₹5k</span>
            <span>₹0</span>
          </div>
          <div className="reports-chart-plot">
            {[35000, 25000, 15000, 5000, 0].map((tick) => (
              <div
                className="reports-chart-gridline"
                style={{ bottom: `${(tick / 35000) * 100}%` }}
                key={tick}
              />
            ))}
            <div className="reports-bars">
              {monthlyRevenue.map((item) => (
                <div className="reports-bar-column" key={item.month}>
                  <span className="reports-bar-value">
                    {(item.revenue / 1000).toFixed(1)}k
                  </span>
                  <div
                    className={`reports-bar ${
                      item.month === "Oct" ? "reports-bar-current" : ""
                    }`}
                    style={{
                      height: `${(item.revenue / maxRevenue) * 82}%`,
                    }}
                    title={`${item.month}: ${currency(item.revenue)}`}
                  />
                  <span className="reports-bar-month">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="reports-demo-note">
          Chart values are illustrative demo figures and are not connected to live transactions.
        </p>
      </section>

      <section className="reports-transactions-card">
        <div className="reports-section-heading reports-table-heading">
          <div>
            <h2>Revenue Transactions</h2>
            <p>Review ride fares and platform commission for each transaction.</p>
          </div>
          <span className="reports-result-count">
            {filteredTransactions.length} transactions
          </span>
        </div>

        <div className="reports-filters">
          <label className="reports-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ride ID, driver or method..."
            />
          </label>

          <label className="reports-date-field">
            <CalendarDays size={15} />
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              aria-label="Start date"
            />
          </label>

          <label className="reports-date-field">
            <CalendarDays size={15} />
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              aria-label="End date"
            />
          </label>

          <select
            className="reports-status-filter"
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            aria-label="Filter by payment status"
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>

          <button className="reports-reset-button" onClick={resetFilters}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="reports-table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Ride ID</th>
                <th>Driver</th>
                <th>Date</th>
                <th>Ride Fare</th>
                <th>Commission</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td className="reports-ride-id">
                    <FileText size={14} />
                    {item.id}
                  </td>
                  <td className="reports-driver-name">{item.driver}</td>
                  <td>{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}</td>
                  <td className="reports-money">{currency(item.fare)}</td>
                  <td className="reports-commission">{currency(item.commission)}</td>
                  <td>{item.method}</td>
                  <td>
                    <span className={`reports-payment-status reports-${item.payment.toLowerCase()}`}>
                      <span />
                      {item.payment}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="reports-empty">
                      <Search size={25} />
                      <strong>No transactions found</strong>
                      <span>Try adjusting your search or filters.</span>
                      <button onClick={resetFilters}>Clear filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="reports-table-footer">
          <span>
            Showing {filteredTransactions.length} of {transactions.length} demo transactions
          </span>
          <button onClick={exportCSV}>
            <Download size={14} />
            Download report
          </button>
        </footer>
      </section>

      <p className="reports-footnote">
        Demo mode: revenue figures, chart values and transactions are sample data.
        Connect your API to display actual financial records.
      </p>
    </div>
  );
}

export default ReportsPage;
