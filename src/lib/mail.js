import { CONTACT } from '@/content/copy';

// Asunto aprobado por David: «Propuesta Vänster × Esade 2027».
export const MAIL_SUBJECT = 'Propuesta Vänster × Esade 2027';
export const MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
    return true;
  } catch {
    return false; // sin permiso de portapapeles: el mailto sigue funcionando
  }
}
