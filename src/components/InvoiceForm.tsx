import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function InvoiceForm({ onCreated }: { onCreated?: () => void }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase.from('customers').select('id, name');
      if (error) console.error('Error fetching customers:', error);
      else setCustomers(data || []);
    }
    fetchCustomers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('invoices').insert([
      {
        customer_id: customerId,
        total_amount: parseFloat(amount),
        status,
      },
    ]);

    setLoading(false);
    if (error) {
      alert('Failed to create invoice');
      console.error(error);
    } else {
      alert('✅ Invoice created!');
      setAmount('');
      setCustomerId('');
      setStatus('pending');
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Create Invoice</h3>
      <div>
        <label>Customer:</label>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
}
