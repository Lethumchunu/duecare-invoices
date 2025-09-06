import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import CustomerProfile from './CustomerProfile';

type Customer = {
  id: string;
  name: string;
  email: string;
};

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers');
      } else {
        console.log('Fetched customers:', data);
        setCustomers(data || []);
      }
      setLoading(false);
    }

    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Customer List</h2>
      {loading && <p>Loading customers...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && customers.length === 0 && <p>No customers found.</p>}
      <ul>
        {customers.map((cust) => (
          <li key={cust.id}>
            <strong>{cust.name}</strong> — {cust.email}
            <button style={{ marginLeft: '1rem' }} onClick={() => setSelectedCustomerId(cust.id)}>
              View
            </button>
          </li>
        ))}
      </ul>

      {selectedCustomerId && (
        <CustomerProfile
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
}
