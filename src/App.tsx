import { useState } from 'react';
import './App.css';
import InvoiceForm from './components/InvoiceForm';
import CustomerForm from './components/CustomerForm';
import InvoiceList from './components/InvoiceList';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import InvoicePreview from './components/InvoicePreview';

function App() {
  const [totalSales, setTotalSales] = useState(100.5);
  const [paidTotal, setPaidTotal] = useState(0);
  const [unpaidTotal, setUnpaidTotal] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // 👈 New state

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">🚀 DueCare</div>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Invoices</a>
          <a href="#">Customers</a>
          <a href="#">Reports</a>
        </nav>
        <div className="user">👤 Lethu</div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Summary Bar */}
        <div className="summary-bar">
          <div>💰 Total Sales: R{totalSales.toFixed(2)}</div>
          <div>✅ Paid: R{paidTotal.toFixed(2)}</div>
          <div>🕒 Unpaid: R{unpaidTotal.toFixed(2)}</div>
        </div>

        {/* 🔁 Top Grid: Create + Add */}
        <div className="grid action-grid">
          <section className="card">
            <h3>Create Invoice</h3>
            <p className="card-subtitle">Fill in invoice details and assign to a customer.</p>
            <InvoiceForm />
          </section>

          <section className="card">
            <h3>Add Customer</h3>
            <p className="card-subtitle">Create a new customer profile for future invoices.</p>
            <CustomerForm />
          </section>
        </div>

        {/* 📈 Monthly Sales Trend — Centered */}
        <div className="summary-charts">
          <section className="card full-width">
            <h3>📈 Monthly Sales Trend</h3>
            <MonthlyTrendChart />
          </section>
        </div>

        {/* Invoice List with Preview Trigger */}
        <div className="card full-width">
          <h3>Invoice List</h3>
          <InvoiceList onSelect={setSelectedInvoice} />
        </div>

        {/* Invoice Preview */}
        {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
      </main>
    </div>
  );
}

export default App;
