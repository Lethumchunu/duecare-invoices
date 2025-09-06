import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function InvoiceEditForm({ invoice, onUpdated }: { invoice: any, onUpdated?: () => void }) {
  const [amount, setAmount] = useState(invoice.total_amount);
  const [status, setStatus] = useState(invoice.status);
  const [deliveryOption, setDeliveryOption] = useState(invoice.delivery_option);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('invoices')
      .update({
        total_amount: parseFloat(amount),
        status,
        delivery_option: deliveryOption
      })
      .eq('id', invoice.id);

    setLoading(false);
    if (error) {
      alert('Failed to update invoice');
      console.error(error);
    } else {
      alert('✅ Invoice updated!');
      onUpdated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#fefefe',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      display: 'grid',
      gap: '1rem'
    }}>
      <h4 style={{ margin: 0 }}>Edit Invoice</h4>

      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          placeholder="e.g. 150.00"
          style={{ width: '100%', padding: '6px', marginTop: '4px' }}
        />
      </label>

      <label>
        Status:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: '100%', padding: '6px', marginTop: '4px' }}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </label>

      <label>
        Delivery Option:
        <select
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
          style={{ width: '100%', padding: '6px', marginTop: '4px' }}
        >
          <option value="Pickup">Pickup</option>
          <option value="Pep 3-5">Pep 3-5</option>
          <option value="Pep 7-9">Pep 7-9</option>
          <option value="Postnet">Postnet</option>
          <option value="Fastway">Fastway</option>
          <option value="Taxi">Taxi</option>
        </select>
      </label>

      <button type="submit" disabled={loading} style={{
        padding: '8px 12px',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        {loading ? 'Updating...' : 'Update Invoice'}
      </button>
    </form>
  );
}
