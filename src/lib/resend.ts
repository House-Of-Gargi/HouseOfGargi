import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const NOREPLY_EMAIL = 'House of Gargi <noreply@gargisaha.com>';
export const CONCIERGE_EMAIL = 'concierge@gargisaha.com';

