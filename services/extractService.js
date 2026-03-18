function findMoney(text, labelPatterns) {
  for (const pattern of labelPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, "");
  }
  return null;
}

function findTerm(text) {
  const match = text.match(/(?:term|months|month term)\s*[:\-]?\s*(\d{2,3})/i);
  return match ? match[1] : null;
}

function findAPR(text) {
  const match = text.match(/(?:apr|annual percentage rate)\s*[:\-]?\s*([\d.]+)%?/i);
  return match ? match[1] : null;
}

function findPayment(text) {
  const match = text.match(/(?:monthly payment|payment)\s*[:\-]?\s*\$?\s*([\d,]+\.\d{2})/i);
  return match ? match[1].replace(/,/g, "") : null;
}

function extractDealFields(text) {
  return {
    salePrice: findMoney(text, [
      /(?:sale price|vehicle price|cash price)\s*[:\-]?\s*\$?\s*([\d,]+\.\d{2})/i
    ]),
    downPayment: findMoney(text, [
      /(?:down payment)\s*[:\-]?\s*\$?\s*([\d,]+\.\d{2})/i
    ]),
    amountFinanced: findMoney(text, [
      /(?:amount financed)\s*[:\-]?\s*\$?\s*([\d,]+\.\d{2})/i
    ]),
    monthlyPayment: findPayment(text),
    termMonths: findTerm(text),
    apr: findAPR(text),
    detectedTextLength: text.length,
    sample: text.substring(0, 200)
  };
}

module.exports = { extractDealFields };

