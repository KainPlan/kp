import { appWithTranslation } from '../i18n';
import '../styles/global.scss';

const KPApp = ({ Component, pageProps }) => <Component {...pageProps} />;
export default appWithTranslation(KPApp);