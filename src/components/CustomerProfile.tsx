import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CustomerProfile({ customerId, onClose }: { customerId: string, onClose: () => void }) {
  const [customer, setCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('id, total_amount, status, created_at, delivery_option')
        .eq('customer_id', customerId);

      setCustomer(customerData);
      setInvoices(invoiceData || []);
      setLoading(false);
    }

    fetchData();
  }, [customerId]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ float: 'right' }}>Close</button>
      <h3>Customer Profile</h3>
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Delivery Preference:</strong> {customer.delivery_option}</p>

      <h4>Invoices</h4>
      <ul>
        {invoices.map((inv) => (
          <li key={inv.id}>
            R{inv.total_amount.toFixed(2)} — {inv.status} — {new Date(inv.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
