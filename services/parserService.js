function cleanNumber(str) {
  if (!str) return null;

  let raw = String(str).replace(/[^0-9.,]/g, "");

  // If both comma and dot exist, assume commas are thousands separators
  if (raw.includes(",") && raw.includes(".")) {
    raw = raw.replace(/,/g, "");
  }

  // If multiple dots exist, keep only the LAST one as decimal point
  const parts = raw.split(".");
  if (parts.length > 2) {
    const decimal = parts.pop();
    raw = parts.join("") + "." + decimal;
  }

  // If only commas exist, convert comma to decimal only when appropriate
  if (raw.includes(",") && !raw.includes(".")) {
    const commaParts = raw.split(",");
    if (commaParts.length === 2 && commaParts[1].length === 2) {
      raw = commaParts[0].replace(/,/g, "") + "." + commaParts[1];
    } else {
      raw = raw.replace(/,/g, "");
    }
  }

  const num = parseFloat(raw);
  return Number.isNaN(num) ? null : num;
}

function findBestNumber(text, keywords) {
  for (const keyword of keywords) {
    const regex = new RegExp(keyword + ".{0,60}?([0-9,\\.]{3,})", "i");
    const match = text.match(regex);
    if (match) {
      return cleanNumber(match[1]);
    }
  }
  return null;
}

function calculateMonthly(amount, apr, months) {
  if (!amount || !apr || !months) return null;

  const annualRate = apr / 100;
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return Math.round((amount / months) * 100) / 100;
  }

  const payment =
    amount *
    (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(payment * 100) / 100;
}

function extractFields(text) {
  const clean = text
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const salePrice = findBestNumber(clean, [
    "sale price",
    "cash price",
    "vehicle price"
  ]);

  const downPayment = findBestNumber(clean, [
    "down payment"
  ]) || 0;

  const aprMatch =
    clean.match(/([0-9]{1,2}\.[0-9]+)\s*%/i) ||
    clean.match(/apr.{0,20}?([0-9]{1,2}\.[0-9]+)/i);

  const apr = aprMatch ? parseFloat(aprMatch[1]) : null;

  const amountFinanced = findBestNumber(clean, [
    "amount financed",
    "amount finance",
    "financed"
  ]);

  const financeCharge = findBestNumber(clean, [
    "finance charge",
    "interest"
  ]);

  const totalPayments = findBestNumber(clean, [
    "total of payments",
    "total payments"
  ]);

  const termMatch =
    clean.match(/([0-9]{2,3})\s*months/i) ||
    clean.match(/([0-9]{2,3})\s*payments/i) ||
    clean.match(/([0-9]{2,3})\s*x\s*\$?[0-9]/i);

  const termMonths = termMatch ? parseInt(termMatch[1], 10) : 72;

  const monthlyPayment = calculateMonthly(
    amountFinanced,
    apr,
    termMonths
  );

  return {
    salePrice,
    downPayment,
    monthlyPayment,
    termMonths,
    apr,
    amountFinanced,
    financeCharge,
    totalPayments
  };
}

module.exports = { extractFields };


























