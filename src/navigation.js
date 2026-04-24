import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

const PRIVACY_POLICY_URL = getPermalink('/privacidad');
const TERMS_URL = getPermalink('/terminos');
const WHATSAPP_URL = 'https://wa.link/3bqb4e';

export const headerData = {
  links: [
    { text: 'Inicio', href: '/' },
    { text: 'Servicios', href: getPermalink('/servicios') },
    { text: 'Proyectos', href: getPermalink('/proyectos') },
    { text: 'Nosotros', href: getPermalink('/nosotros') },
    { text: 'Blog', href: getBlogPermalink() },
    { text: 'Contacto', href: getPermalink('/contacto') },
  ],
  actions: [
    {
      variant: 'primary',
      text: 'Solicitar asesoría gratis',
      href: getPermalink('/contacto'),
    },
  ],
};

export const footerData = {
  brand: {
    description:
      'Creamos soluciones digitales para empresas que quieren crecer, automatizar procesos y vender más.',
  },
  links: [
    {
      title: 'Servicios',
      links: [
        { text: 'Software a medida', href: getPermalink('/servicios#catalogo') },
        { text: 'Páginas web', href: getPermalink('/servicios#catalogo') },
        { text: 'Automatización', href: getPermalink('/servicios#catalogo') },
        { text: 'IA y bots', href: getPermalink('/servicios#catalogo') },
        { text: 'Cloud y servidores', href: getPermalink('/servicios#catalogo') },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { text: 'Nosotros', href: getPermalink('/nosotros') },
        { text: 'Proyectos', href: getPermalink('/proyectos') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contacto', href: getPermalink('/contacto') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Privacidad', href: PRIVACY_POLICY_URL },
        { text: 'Términos', href: TERMS_URL },
      ],
    },
  ],
  contact: {
    title: 'Contacto',
    email: 'contacto@tachetech.com',
    phone: '+57 301 374 5541',
    phoneHref: 'tel:+573013745541',
    whatsapp: WHATSAPP_URL,
    location: 'Montería, Córdoba, Colombia',
  },
  secondaryLinks: [
    { text: 'Términos y Condiciones', href: TERMS_URL },
    { text: 'Política de privacidad', href: PRIVACY_POLICY_URL },
  ],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: WHATSAPP_URL },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
  ],
  copyright: `© ${new Date().getFullYear()} Tache Technology. Todos los derechos reservados.`,
  madeIn: 'Hecho con tecnología desde Montería, Colombia.',
};

export { WHATSAPP_URL };
