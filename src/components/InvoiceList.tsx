import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import InvoiceEditForm from './InvoiceEditForm';
import InvoiceActions from './InvoiceActions';

type Invoice = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivery_option: string;
  customers: {
    name: string;
    email: string;
  };
};

export default function InvoiceList({ onSelect }: { onSelect?: (invoice: Invoice) => void }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showEditId, setShowEditId] = useState<string | null>(null);

  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    async function fetchInvoices() {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          delivery_option,
          customers (
            name,
            email
          )
        `);

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        setInvoices(data || []);
      }
      setLoading(false);
    }

    fetchInvoices();
  }, [refreshKey]);

  const filteredInvoices = invoices.filter((inv) => {
    const nameMatch = inv.customers?.name?.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = statusFilter ? inv.status === statusFilter : true;
    const dateMatch =
      (!startDate || new Date(inv.created_at) >= new Date(startDate)) &&
      (!endDate || new Date(inv.created_at) <= new Date(endDate));

    return nameMatch && statusMatch && dateMatch;
  });

  return (
    <div>
      <h2>Invoice List</h2>

      {/* 🔍 Filter UI */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ marginRight: '1rem' }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginRight: '1rem' }}>
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="pending">Pending</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {loading && <p>Loading invoices...</p>}
      {!loading && filteredInvoices.length === 0 && <p>No invoices match your filters.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredInvoices.map((inv) => (
          <li
            key={inv.id}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #eee'
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              R{inv.total_amount.toFixed(2)} — {inv.customers?.name || 'Unknown Customer'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor:
                    inv.status === 'paid' ? '#4caf50' :
                    inv.status === 'unpaid' ? '#f44336' :
                    '#ff9800',
                  color: '#fff',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                {inv.status}
              </span>

              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                {new Date(inv.created_at).toLocaleDateString()}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#444', marginBottom: '0.5rem' }}>
              Delivery: {inv.delivery_option}
            </div>

            {/* 🛠️ Button Group */}
            <div className="button-group">
                <button className="action-btn" onClick={() => setShowEditId(inv.id)}>Edit</button>
                {onSelect && <button className="action-btn" onClick={() => onSelect(inv)}>Preview</button>}
            </div>


            {/* 🧾 Inline Edit Form */}
            {showEditId === inv.id && (
              <InvoiceEditForm
                invoice={inv}
                onUpdated={() => {
                  setShowEditId(null);
                  setRefreshKey((k) => k + 1);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
