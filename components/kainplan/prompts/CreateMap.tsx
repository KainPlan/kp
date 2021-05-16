import ClassicalInput from "../ClassicalInput";
import BeautifulButton from "../BeautifulButton";
import style from './CreateMap.module.scss';
import MultiStepForm from "../MultiStepForm";
import { withTranslation, Router } from "../../../i18n";
import { WithTranslation } from "next-i18next";
import ImageUpload from "../ImageUpload";

interface CreateMapProps extends WithTranslation {
};

const CreateMap = ({ t, }: CreateMapProps) => {
  let name: string;
  let desc: string;
  
  let form;
  let nameIn: HTMLInputElement;
  let descIn: HTMLTextAreaElement;
  let baseIn: ImageUpload;

  const onSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    name = nameIn.value;
    desc = descIn.value;
    form.next();
  };

  const onCreateMap = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(baseIn.img.src);
    fetch('/api/maps/make', {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        name: nameIn.value,
        desc : descIn.value,
        background : baseIn.img.src
      }),
    }).then(res => res.json())
      .then(res => {
        if (res.success) Router.push(`/edit/${res.body.id}`);
      })
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
              <ClassicalInput ref={e => nameIn = e as HTMLInputElement} label={t('dashboard_maps:create_map_name')} required />
            </div>
            <div>
              <ClassicalInput ref={e => descIn = e as HTMLTextAreaElement} textArea label={t('dashboard_maps:create_map_desc')} maxLength={140} required />
            </div>
            <div className={style.buttonWrapper}>
              <BeautifulButton label={t('common:next')} type="submit" />
            </div>
          </form>,
          <form className={style.root} onSubmit={onCreateMap}>
            <ImageUpload 
              label={t('dashboard_maps:create_map_base_map')} 
              incentive={t('dashboard_maps:create_map_base_map_drop')}
              ref={e => baseIn = e}
            />
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