import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Inicio', href: '/' },
    /*  {
       text: 'Pages',
       links: [
 
         {
           text: 'Pricing',
           href: getPermalink('/pricing'),
         },
         {
           text: 'About us',
           href: getPermalink('/about'),
         },
         {
           text: 'Privacy policy',
           href: getPermalink('/privacy'),
         },
       ],
     },
      {
        text: 'Blog',
        links: [
          {
            text: 'Blog List',
            href: getBlogPermalink(),
          },
          {
            text: 'Article',
            href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
          },
          {
            text: 'Article (with MDX)',
            href: getPermalink('markdown-elements-demo-post', 'post'),
          },
          {
            text: 'Category Page',
            href: getPermalink('tutorials', 'category'),
          },
          {
            text: 'Tag Page',
            href: getPermalink('astro', 'tag'),
          },
        ],
      }, */
    {
      text: 'Servicios',
      href: getPermalink('/servicios'),
    },
    {
      text: 'Contacto',
      href: getPermalink('/contacto'),
    },
    {
      text: 'Términos',
      href: getPermalink('/terminos'),
    },
    {
      text: 'Privacidad',
      href: getPermalink('/privacidad'),
    },
    {
      text: 'FAQS',
      href: getPermalink('/#faqs'),
    },
  ],
  actions: [{ text: 'Whatsapp', href: 'https://wa.link/3bqb4e', icon: 'tabler:brand-whatsapp', target: '_blank', }],
};

export const footerData = {
  links: [
  ],
  secondaryLinks: [
    { text: 'Términos y Condiciones', href: getPermalink('/terminos') },
    { text: 'Politicas de privacidad', href: getPermalink('/privacidad') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
  `,
};
