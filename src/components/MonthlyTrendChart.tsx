import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

type MonthlyDataPoint = {
  month: string;
  total: number;
};

export default function MonthlyTrendChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlySales() {
      const { data, error } = await supabase
        .from('invoices')
        .select('amount, created_at')
        .eq('status', 'paid');

      if (error) {
        console.error('❌ Failed to fetch monthly sales:', error);
        setLoading(false);
        return;
      }

      const monthlyTotals = data?.reduce((acc: Record<string, number>, invoice) => {
        const month = new Date(invoice.created_at).toISOString().slice(0, 7); // "YYYY-MM"
        acc[month] = (acc[month] || 0) + invoice.amount;
        return acc;
      }, {});

      const formattedData = Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        total: Number(total.toFixed(2))
      }));

      setMonthlyData(formattedData);
      setLoading(false);
    }

    fetchMonthlySales();
  }, []);

  if (loading) return <p>Loading monthly trend...</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
