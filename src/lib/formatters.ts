/**
 * Funções utilitárias para formatação de dados
 */

/**
 * Normaliza o nome para ter apenas a primeira letra de cada palavra em maiúscula
 * @param name - Nome a ser normalizado
 * @returns Nome normalizado
 */
export function normalizeName(name: string): string {
  if (!name) return "";

  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formata o telefone para o padrão (99) 99999-9999
 * Remove o código do país 55 se presente
 * @param phone - Telefone a ser formatado
 * @returns Telefone formatado
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";

  // Remove todos os caracteres não numéricos
  let cleanPhone = phone.replace(/\D/g, "");

  // Remove o código do país 55 se presente
  if (cleanPhone.startsWith("55") && cleanPhone.length > 10) {
    cleanPhone = cleanPhone.substring(2);
  }

  // Aplica a máscara baseada no tamanho
  if (cleanPhone.length === 10) {
    // Telefone fixo: (99) 9999-9999
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length === 11) {
    // Celular: (99) 99999-9999
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length > 0) {
    // Para números com tamanho diferente, retorna apenas os dígitos limpos
    return cleanPhone;
  }

  return "";
}

/**
 * Formata o telefone mantendo o código do país para armazenamento
 * @param phone - Telefone a ser formatado
 * @returns Telefone formatado com código do país
 */
export function formatPhoneForStorage(phone: string): string {
  if (!phone) return "";

  // Remove todos os caracteres não numéricos
  let cleanPhone = phone.replace(/\D/g, "");

  // Se não tem código do país, adiciona 55
  if (!cleanPhone.startsWith("55") && cleanPhone.length >= 10) {
    cleanPhone = "55" + cleanPhone;
  }

  return cleanPhone;
}
