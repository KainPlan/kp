import { WithTranslation } from "next-i18next";
import { withTranslation, Router } from "../../../i18n";
import ImageUpload from '../ImageUpload';
import BeautifulButton from '../BeautifulButton';
import Map from "../Map";
import Popup from "../Popup";
import { FormEvent, MutableRefObject } from "react";

interface AddFloorProps extends WithTranslation {
  map: MutableRefObject<Map>;
  popup: MutableRefObject<Popup>;
};

const AddFloor = ({ t, map, popup, }: AddFloorProps) => {
  let backIn: ImageUpload;

  const onCreateFloor = (e: FormEvent) => {
    e.preventDefault();
    map.current.addFloor(backIn.img.src);
    popup.current.hide();
  };

  return (
    <form onSubmit={onCreateFloor}>
      <ImageUpload 
        label={t('dashboard_maps:create_map_base_map')} 
        incentive={t('dashboard_maps:create_map_base_map_drop')}
        ref={e => backIn = e}
      />
      <div>
        <BeautifulButton label={t('dashboard_maps:create_map_create')} type="submit" />
      </div>
    </form>
  );
};

export default withTranslation()(AddFloor);