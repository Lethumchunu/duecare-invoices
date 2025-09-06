import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SalesSummary() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    async function fetchInvoices() {
      let query = supabase
        .from('invoices')
        .select('total_amount, status, created_at');

      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data, error } = await query;

      if (error) console.error(error);
      else setInvoices(data || []);
      setLoading(false);
    }

    fetchInvoices();
  }, [startDate, endDate]);

  const totalSales = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const paidSales = invoices.filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total_amount, 0);
  const unpaidSales = invoices.filter((i) => i.status === 'unpaid')
    .reduce((sum, i) => sum + i.total_amount, 0);

  const monthlyTotals = invoices.reduce((acc, inv) => {
    const date = new Date(inv.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + inv.total_amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>📈 Sales Summary</h2>

      {/* ✅ Date Range Filter */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label style={{ marginLeft: '1rem' }}>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {loading ? <p>Loading...</p> : (
        <div>
          <p><strong>Total Sales:</strong> R{totalSales.toFixed(2)}</p>
          <p><strong>Paid:</strong> R{paidSales.toFixed(2)}</p>
          <p><strong>Unpaid:</strong> R{unpaidSales.toFixed(2)}</p>

          {/* ✅ Monthly Totals */}
          <h4>Monthly Totals:</h4>
          <ul>
            {Object.entries(monthlyTotals).map(([month, total]) => (
              <li key={month}>{month}: R{total.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
