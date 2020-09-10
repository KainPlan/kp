import ClassicalInput from "../ClassicalInput";
import BeautifulButton from "../BeautifulButton";
import style from './CreateMap.module.scss';
import MultiStepForm from "../MultiStepForm";
import { withTranslation } from "../../../i18n";
import { WithTranslation } from "next-i18next";

interface CreateMapProps extends WithTranslation {
};

const CreateMap = ({ t, }: CreateMapProps) => {
  let name: string;
  let desc: string;
  
  let form;
  let nameIn: HTMLInputElement;
  let descIn: HTMLTextAreaElement;

  const onSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    name = nameIn.value;
    desc = descIn.value;
    form.next();
  };

  const onCreateMap = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <MultiStepForm 
        ref={e => form = e}
        labels={[
          t('dashboard_maps:create_map_details'),
          t('dashboard_maps:create_map_base_map'),
        ]} 
        forms={[
          <form className={style.root} onSubmit={onSubmitDetails}>
            <div>
              <ClassicalInput ref={e => nameIn = e} label={t('dashboard_maps:create_map_name')} required />
            </div>
            <div>
              <ClassicalInput ref={e => descIn = e} textArea label={t('dashboard_maps:create_map_desc')} maxLength={140} required />
            </div>
            <div className={style.buttonWrapper}>
              <BeautifulButton label={t('common:next')} type="submit" />
            </div>
          </form>,
          <form className={style.root} onSubmit={onCreateMap}>

            <div className={style.buttonWrapper}>
              <BeautifulButton label={t('dashboard_maps:create_map_create')} type="submit" />
            </div>
          </form>
        ]}
      />
    </div>
  );
}

export default withTranslation()(CreateMap);