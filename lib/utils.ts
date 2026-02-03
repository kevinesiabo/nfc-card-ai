import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  // Format français : +33 6 12 34 56 78
  const cleaned = phone.replace(/\D/g, '');
  // Si le numéro commence par 0, remplacer par 33
  let normalized = cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    normalized = '33' + cleaned.slice(1);
  }
  if (normalized.startsWith('33') && normalized.length === 11) {
    const formatted = `+${normalized.slice(0, 2)} ${normalized.slice(2, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 7)} ${normalized.slice(7, 9)} ${normalized.slice(9, 11)}`;
    return formatted.trim();
  }
  return phone;
}

export function generateGoogleCalendarLink(appointment: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}): string {
  const start = new Date(`${appointment.date}T${appointment.startTime}`);
  const end = new Date(`${appointment.date}T${appointment.endTime}`);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: appointment.title,
    dates: `${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    details: appointment.description || '',
    location: appointment.location || '',
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateGoogleMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function generateWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const text = message ? `&text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleaned}${text}`;
}

export function generateVCard(profile: {
  name: string;
  phone: string;
  email: string;
  position?: string;
  company?: string;
  address?: string;
  whatsapp?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
    `N:${profile.name.split(' ').reverse().join(';')};;;`,
    profile.position ? `TITLE:${profile.position}` : '',
    profile.company ? `ORG:${profile.company}` : '',
    `TEL;TYPE=CELL,VOICE:${profile.phone}`,
    profile.whatsapp ? `TEL;TYPE=CELL,WA:${profile.whatsapp}` : '',
    `EMAIL;TYPE=WORK:${profile.email}`,
    profile.address ? `ADR;TYPE=WORK:;;${profile.address};;;;` : '',
    profile.linkedin ? `URL;TYPE=LinkedIn:${profile.linkedin}` : '',
    profile.twitter ? `URL;TYPE=Twitter:${profile.twitter}` : '',
    profile.website ? `URL;TYPE=Website:${profile.website}` : '',
    'END:VCARD',
  ].filter(line => line !== '').join('\n');
  
  return vcard;
}

export function downloadVCard(vcard: string, filename: string = 'contact.vcf'): void {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

