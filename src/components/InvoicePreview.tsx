import './InvoicePreview.css';
import html2pdf from 'html2pdf.js';

export default function InvoicePreview({ invoice }: { invoice: any }) {
  function handleDownloadPDF() {
    const element = document.querySelector('.invoice-preview');
    if (element) {
      html2pdf().from(element).save('invoice.pdf');
    }
  }

  return (
    <div className="invoice-preview card full-width">
      {/* 🔹 1. Header */}
      <header className="invoice-header">
        <div className="brand">🚀 DueCare</div>
        <h2>Invoice</h2>
        <div className="meta">
          <span>Invoice #: {invoice.number}</span>
          <span>Date Issued: {invoice.date}</span>
          {invoice.dueDate && <span>Due Date: {invoice.dueDate}</span>}
        </div>
      </header>

      {/* 🔹 2. Customer Details */}
      <section className="invoice-section">
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> {invoice.customerName}</p>
        <p><strong>Email:</strong> {invoice.customerEmail}</p>
        <p><strong>Delivery:</strong> {invoice.deliveryOption}</p>
        {invoice.billingAddress && <p><strong>Billing Address:</strong> {invoice.billingAddress}</p>}
      </section>

      {/* 🔹 3. Invoice Items */}
      <section className="invoice-section">
        <h3>Items</h3>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>R{item.unitPrice.toFixed(2)}</td>
                <td>R{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="totals">
          <p><strong>Subtotal:</strong> R{invoice.subtotal.toFixed(2)}</p>
          {invoice.tax && <p><strong>Tax:</strong> R{invoice.tax.toFixed(2)}</p>}
          {invoice.discount && <p><strong>Discount:</strong> -R{invoice.discount.toFixed(2)}</p>}
          <p><strong>Total Due:</strong> R{invoice.total.toFixed(2)}</p>
        </div>
      </section>

      {/* 🔹 4. Payment Status */}
      <section className="invoice-section">
        <h3>Payment</h3>
        <p><strong>Status:</strong> {invoice.status}</p>
        {invoice.paymentMethod && <p><strong>Method:</strong> {invoice.paymentMethod}</p>}
        {invoice.datePaid && <p><strong>Date Paid:</strong> {invoice.datePaid}</p>}
      </section>

      {/* 🔹 5. Footer */}
      <footer className="invoice-footer">
        <p>Thank you for your business!</p>
        <p>Contact: support@duecare.co.za</p>
        {invoice.terms && <p className="terms">{invoice.terms}</p>}
      </footer>

      {/* 🖨️ Print & 📦 PDF Buttons */}
      <div className="button-group">
        <button className="action-btn" onClick={() => window.print()}>
          🖨️ Print
        </button>
        <button className="action-btn" onClick={handleDownloadPDF}>
          📦 Download PDF
        </button>
      </div>
    </div>
  );
}
