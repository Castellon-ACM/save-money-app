export function todayISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

export function fmtMoney(n) {
  const v = Math.round((n + Number.EPSILON) * 100) / 100;
  return (
    v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  );
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Días entre dos fechas ISO, contando el propio día de inicio (inclusivo)
export function daysBetweenInclusive(fromISO, toISO) {
  const a = new Date(fromISO + 'T00:00:00');
  const b = new Date(toISO + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}

// El corazón de la app: cuánto queda para gastar HOY sin quedarse a cero
// antes de la fecha límite del presupuesto.
export function computeAvailable(profile, expenses, goals) {
  const spent = expenses.reduce((a, e) => a + e.amount, 0);
  const saved = goals.reduce((a, g) => a + g.saved, 0);
  const remaining = Math.max(0, profile.total - spent - saved);
  const today = todayISO();
  let daysLeft = daysBetweenInclusive(today, profile.end) + 1;
  if (daysLeft < 1) daysLeft = 1;
  const daily = remaining / daysLeft;
  return { remaining, daysLeft, daily, spent, saved };
}
