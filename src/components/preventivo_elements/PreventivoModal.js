import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PreventivoForm from './PreventivoForm';

const defaulData = {"pages":[{"id":"1","title":"BRAND IDENTITY & BRAND PROTECTION","items":[{"id":"aefdbe14-739d-425e-9634-23b42b2c62c1","type":"title","content":"Title"},{"id":"4b51ec04-1162-4232-8463-f7f833162635","type":"link","content":"Link"}]},{"id":"2","title":"SITO WEB: SVILUPPO & ASSISTENZA TECNICA","items":[{"id":"aefdbe14-739d-425e-9634-23b42b2c62c1","type":"title","content":"Title"},{"id":"f2503f9d-8475-474d-9829-e224c68d0ab6","type":"hero","content":"Hero Section"}]},{"id":"3","title":"SEO","subtitle":"Search Engine Optimization","items":[{"id":"6ca94a89-5742-406a-b5d2-0eb2c878559b","type":"hero","content":"Hero Section"},{"id":"3c4abf7e-f248-4b43-8045-43b2e246e6fe","type":"image","content":"Image"}]},{"id":"4","title":"SEM","subtitle":"Search Engine Marketing","items":[{"id":"45c2490e-6284-4fd8-a73e-d75ceb88e617","type":"image","content":"Image"}]},{"id":"5","title":"DEM","subtitle":"Direct Email Marketing","items":[{"id":"90858945-9cf9-45dc-915b-b386d90e022c","type":"link","content":"Link"}]},{"id":"6","title":"SOCIAL","subtitle":"NETWORK","items":[{"id":"87244f1a-de9d-4f9b-8b7d-dd49a3d81237","type":"textarea","content":"Textarea"}]}],"sidebar":{"id":"sidebar","items":[{"id":"7","type":"button","content":"Button"},{"id":"8","type":"title","content":"Title"},{"id":"9","type":"hero","content":"Hero Section"},{"id":"10","type":"image","content":"Image"},{"id":"11","type":"link","content":"Link"},{"id":"12","type":"textarea","content":"Textarea"},{"id":"13","type":"container","content":"Container","items":[]},{"id":"14","type":"gallery","content":"Carousel"},{"id":"15","type":"form","content":"Form"}]},"pageArea":{"id":"pageArea","items":[{"id":"aefdbe14-739d-425e-9634-23b42b2c62c1","type":"title","content":"Title"},{"id":"4b51ec04-1162-4232-8463-f7f833162635","type":"link","content":"Link"}]}}

const PreventivoModal = ({preventivo, clients, categories, onSave, onClose}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (formData) => {
    let slug;
    let data;
    if (formData.id) { 
        slug = formData.slug;
        data = formData.data;
      } else {
        data = defaulData;
        slug = uuidv4();
      }
    const newPreventivo = {
        ...formData,
        slug,
        data,
      };
    onSave(newPreventivo);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <label htmlFor="createEdit" onClick={handleOpen} className={`${preventivo ? 'm1 cursor-pointer' : 'btn m-1 btn-xs btn-success text-white'}`}>{ preventivo ? '🛠' : '🤑 Nuovo Preventivo'}</label>
      {isOpen && (
        <>
        <input type="checkbox" id="createEdit" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <PreventivoForm
              preventivo={preventivo}
              clients={clients}
              categories={categories}
              onSave={handleSave}
              onClose={handleClose}
            />
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default PreventivoModal;
