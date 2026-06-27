/**
 * Formata um valor numérico para Reais (BRL).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata uma string de data para o padrão brasileiro (DD/MM/AAAA HH:MM).
 */
export function formatDate(date: string | Date, includeTime = false): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return new Intl.DateTimeFormat('pt-BR', options).format(d)
}
