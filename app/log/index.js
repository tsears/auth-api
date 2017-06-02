
module.exports = {
    Log,
}

function Log(area, severity, message, data) {
  const time = new Date().toISOString();
  console.log(`[${time}][${area}][${severity}]: ${message}`, data || '');
}
