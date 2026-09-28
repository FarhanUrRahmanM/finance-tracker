export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  try {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    const symbol = currency === 'INR' ? '₹' : '$';

    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

    const sign = amount < 0 ? '-' : '';
    return `${sign}${symbol}${formatted}`;
  } catch (e) {
    return `₹${amount}`;
  }
};
