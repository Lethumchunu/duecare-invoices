import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CustomerForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('Pickup');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Try to get the user ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    // Build the customer object
    const customerPayload: any = {
      name,
      email,
      delivery_option: deliveryOption
    };

    // Only include created_by if user is logged in
    if (userId) {
      customerPayload.created_by = userId;
    }

    const { data, error } = await supabase
      .from('customers')
      .upsert(customerPayload, { onConflict: ['email'] })
      .select();

    setLoading(false);

    if (error) {
      alert('❌ Failed to save customer');
      console.error(error);
    } else if (!data || data.length === 0) {
      alert('⚠️ No customer was saved. Check RLS or schema issues.');
    } else {
      alert('✅ Customer saved!');
      setName('');
      setEmail('');
      setDeliveryOption('Pickup');
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
      <h3>Add New Customer</h3>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Delivery Option:
        <select value={deliveryOption} onChange={(e) => setDeliveryOption(e.target.value)}>
          <option value="Pickup">Pickup</option>
          <option value="Pep 3-5">Pep 3-5</option>
          <option value="Pep 7-9">Pep 7-9</option>
          <option value="Postnet">Postnet</option>
          <option value="Fastway">Fastway</option>
          <option value="Taxi">Taxi</option>
        </select>
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Customer'}
      </button>
    </form>
  );
}
