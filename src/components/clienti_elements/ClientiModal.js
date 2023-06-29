import { useState } from 'react';
import ClientiForm from './ClientiForm';


const ClientiModal = ({ cliente, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (formData) => {

    const newCliente = {
      ...formData
    };
    onSave(newCliente);
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
      <label htmlFor="createEdit" onClick={handleOpen} className={`${cliente ? 'm1 cursor-pointer' : 'btn m-1 btn-xs btn-success text-white'}`}>{cliente ? '🛠' : 'Nuovo Cliente'}</label>
      {isOpen && (
        <>
          <input type="checkbox" id="createEdit" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <ClientiForm
                cliente={cliente}
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

export default ClientiModal;
