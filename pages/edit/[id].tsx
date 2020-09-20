import { withTranslation, Link } from '../../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../../models/User';
import { useRouter } from 'next/router';
import style from './[id].module.scss';
import Map from '../../components/kainplan/Map';
import Head from 'next/head';

interface EditProps extends WithTranslation, WithUser {
};

const Edit = ({ t, }: EditProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
        <title>asdf</title>
      </Head>
      <div className={style.root}>
        <Map 
          id={router.query.id as string}
          fullscreen
        ></Map>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </>
  );
};

Edit.getInitialProps = async () => ({
  namespacesRequired: ['common','edit',],
});

export default withTranslation()(Edit);