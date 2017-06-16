export default function Log (area, severity, message, data) {
  const time = new Date().toISOString()
  const outData = data || ''
  console.log(`[${time}][${area}][${severity}]: ${message}`, outData)
}
