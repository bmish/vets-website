import i18n from 'platform/site-wide/localization';
import en from './en.json';
import es from './es.json';
import tl from './tl.json';

const namespace = 'caregivers';

i18n.addResourceBundle('en', namespace, en);
i18n.addResourceBundle('es', namespace, es);
i18n.addResourceBundle('tl', namespace, tl);

export default i18n;
