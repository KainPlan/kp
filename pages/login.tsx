import asdf from './login.module.scss';
import Login from '../components/kainplan/login';
import { Link } from '../i18n';

const Index = () => (
    <div className={asdf.wrapper}>
        <Link href="/">
            <h1 className={asdf.root}>Kainplan</h1>
        </Link>
        <Login/>
        <style jsx global>{`
          body {
              background-color: #73c7d2; 
          }
        `}</style> 
    </div>
);

export default Index;