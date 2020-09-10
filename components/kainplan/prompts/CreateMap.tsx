import ClassicalInput from "../ClassicalInput";
import BeautifulButton from "../BeautifulButton";
import style from './CreateMap.module.scss';

const CreateMap = ({}) => {

  return (
    <form className={style.root}>
      <div>
        <ClassicalInput label="Name" />
      </div>
      <div>
        <ClassicalInput textArea label="Description" maxLength={140} />
      </div>
      <div className={style.buttonWrapper}>
        <BeautifulButton label={"Next"} type="submit" />
      </div>
    </form>
  );
}

export default CreateMap;