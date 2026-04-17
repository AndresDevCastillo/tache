import { getPermalink, getAsset } from './utils/permalinks';

const PRIVACY_POLICY_URL = 'https://tachetech.com/privacidad/';
const WHATSAPP_URL = 'https://wa.link/3bqb4e';

export const headerData = {
  links: [
    { text: 'Inicio', href: '/' },
    { text: 'Nosotros', href: getPermalink('/#nosotros') },
    { text: 'Servicios', href: getPermalink('/servicios') },
    { text: 'Proceso', href: getPermalink('/#proceso') },
    { text: 'Contacto', href: getPermalink('/contacto') },
    { text: 'FAQs', href: getPermalink('/#faqs') },
  ],
  actions: [
    {
      variant: 'primary',
      text: 'WhatsApp',
      href: WHATSAPP_URL,
      icon: 'tabler:brand-whatsapp',
      target: '_blank',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Empresa',
      links: [
        { text: 'Sobre nosotros', href: getPermalink('/#nosotros') },
        { text: 'Servicios', href: getPermalink('/servicios') },
        { text: 'Proceso', href: getPermalink('/#proceso') },
        { text: 'Contacto', href: getPermalink('/contacto') },
      ],
    },
    {
      title: 'Servicios',
      links: [
        { text: 'Desarrollo web', href: getPermalink('/servicios#catalogo') },
        { text: 'Aplicaciones a medida', href: getPermalink('/servicios#catalogo') },
        { text: 'Automatización con IA', href: getPermalink('/servicios#catalogo') },
        { text: 'Cloud y DevOps', href: getPermalink('/servicios#catalogo') },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { text: 'Blog', href: getPermalink('/') },
        { text: 'FAQs', href: getPermalink('/#faqs') },
        { text: 'Cotizar proyecto', href: getPermalink('/#contacto') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Términos y Condiciones', href: getPermalink('/terminos') },
    { text: 'Política de privacidad', href: PRIVACY_POLICY_URL },
  ],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: WHATSAPP_URL },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} <span class="font-semibold text-slate-200">Tache Technology</span>. Todos los derechos reservados.
  `,
};
