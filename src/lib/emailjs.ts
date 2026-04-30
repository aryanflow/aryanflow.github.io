import emailjs from '@emailjs/browser'

export const EMAILJS_KEY = 'seCKWFuPSTJAb1zqo'
export const EMAILJS_SERVICE = 'aryankashyap_email'
export const EMAILJS_TEMPLATE = 'aryankashyap_template'

export function initEmailjs() {
  emailjs.init(EMAILJS_KEY)
}

export async function sendContactForm(form: HTMLFormElement) {
  return emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, form, EMAILJS_KEY)
}
