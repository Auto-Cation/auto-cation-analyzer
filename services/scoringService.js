function scoreDeal(fields) {
  let score = 100;
  const flags = [];

  const salePrice = Number(fields.salePrice) || 0;
  const downPayment = Number(fields.downPayment) || 0;
  const monthlyPayment = Number(fields.monthlyPayment) || 0;
  const termMonths = Number(fields.termMonths) || 0;
  const apr = fields.apr !== null && fields.apr !== undefined ? Number(fields.apr) : null;
  const amountFinanced = Number(fields.amountFinanced) || 0;
  const financeCharge = Number(fields.financeCharge) || 0;
  const totalPayments = Number(fields.totalPayments) || 0;

  // APR scoring
  if (apr !== null) {
    if (apr > 12) {
      score -= 30;
      flags.push("High APR");
    } else if (apr > 8) {
      score -= 20;
      flags.push("Elevated APR");
    } else if (apr > 5) {
      score -= 10;
      flags.push("Moderate APR");
    } else if (apr <= 4.5) {
      score += 2;
    }
  } else {
    score -= 8;
    flags.push("APR missing");
  }

  // Term scoring
  if (termMonths >= 84) {
    score -= 20;
    flags.push("Very long term");
  } else if (termMonths >= 72) {
    score -= 10;
    flags.push("Long term");
  } else if (termMonths >= 60) {
    score -= 4;
  } else if (termMonths > 0 && termMonths < 48) {
    score += 3;
  } else if (!termMonths) {
    score -= 6;
    flags.push("Term missing");
  }

  // Down payment scoring
  if (salePrice > 0) {
    const downRatio = downPayment / salePrice;

    if (downPayment === 0) {
      score -= 6;
      flags.push("No down payment");
    } else if (downRatio < 0.05) {
      score -= 4;
      flags.push("Low down payment");
    } else if (downRatio >= 0.15) {
      score += 4;
    }
  }

  // Finance charge scoring
  if (amountFinanced > 0 && financeCharge > 0) {
    const financeRatio = financeCharge / amountFinanced;

    if (financeRatio > 0.35) {
      score -= 20;
      flags.push("Very high finance charge");
    } else if (financeRatio > 0.20) {
      score -= 12;
      flags.push("High finance charge");
    } else if (financeRatio > 0.10) {
      score -= 6;
      flags.push("Moderate finance charge");
    } else if (financeRatio < 0.03) {
      score += 3;
    }
  } else if (financeCharge === 0 && amountFinanced > 0) {
    score += 2;
  }

  // Payment burden scoring
  if (monthlyPayment > 0 && salePrice > 0) {
    const paymentRatio = monthlyPayment / salePrice;

    if (paymentRatio > 0.03) {
      score -= 10;
      flags.push("Heavy monthly payment");
    } else if (paymentRatio > 0.02) {
      score -= 5;
      flags.push("Higher monthly burden");
    }
  }

  // Amount financed vs sale price
  if (salePrice > 0 && amountFinanced > 0) {
    const financedRatio = amountFinanced / salePrice;

    if (financedRatio > 1.0) {
      score -= 8;
      flags.push("Financed over sale price");
    } else if (financedRatio > 0.95) {
      score -= 4;
      flags.push("High financed balance");
    }
  }

  // Total payments if available
  if (totalPayments > 0 && salePrice > 0) {
    const totalRatio = totalPayments / salePrice;

    if (totalRatio > 1.5) {
      score -= 15;
      flags.push("Very expensive total payback");
    } else if (totalRatio > 1.3) {
      score -= 8;
      flags.push("High total payback");
    }
  }

  // Clamp score
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // Rating
  let rating = "Needs Review";
  if (score >= 85) {
    rating = "🔥 Strong Deal";
  } else if (score >= 70) {
    rating = "✅ Fair Deal";
  } else if (score >= 55) {
    rating = "⚠️ Caution";
  } else {
    rating = "🚨 Risky Deal";
  }

  return {
    score,
    rating,
    flags
  };
}

module.exports = { scoreDeal };




