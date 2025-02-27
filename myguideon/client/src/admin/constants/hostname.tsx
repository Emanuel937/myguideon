const HOSTNAME_WEB = process.env.NODE_ENV === 'production'
  ? 'https://xs.codaby.fr/api'
  : 'http://localhost:3030';

export default HOSTNAME_WEB;
