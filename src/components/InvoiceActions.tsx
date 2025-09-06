import jsPDF from 'jspdf';

export default function InvoiceActions({ invoice }: { invoice: any }) {
  function handleDownloadPDF() {
    const doc = new jsPDF();
    doc.text(`Invoice #${invoice.id}`, 10, 10);
    doc.text(`Customer: ${invoice.customers?.name}`, 10, 20);
    doc.text(`Amount: R${invoice.total_amount.toFixed(2)}`, 10, 30);
    doc.text(`Status: ${invoice.status}`, 10, 40);
    doc.text(`Delivery: ${invoice.delivery_option}`, 10, 50);
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 10, 60);
    doc.save(`invoice-${invoice.id}.pdf`);
  }

  function handlePrint() {
    window.print(); // Or use react-to-print for scoped printing
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      <button onClick={handlePrint} style={{ marginLeft: '1rem' }}>Print</button>
    </div>
  );
}
