export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calcNights(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
}

export function getStatusColor(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
}

export function truncate(str, max = 80) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}
