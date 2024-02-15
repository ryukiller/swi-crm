'use state'
import { useState, useEffect } from "react";

const ClientiForm = ({
  cliente,
  onSave,
  onClose,
}) => {
  const [formState, setFormState] = useState({
    nome: "",
    email: "",
    stato: 0,
    phone_number: "",
    website: "",
    notes: "",
    property: "",
    facebookid: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormState(cliente);
    }
  }, [cliente]);

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formState);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="hero-content flex-col">
        <div className="text-left">
          <h3 className="text-2xl font-bold">
            {cliente ? "Modifica Cliente" : "Crea Nuovo Cliente"}
          </h3>
          <p className="py-2">
            {cliente
              ? "Modifica le impostazioni base del cliente"
              : "Crea un nuovo cliente, qui compili le informazioni base."}
          </p>
        </div>
        <div className="flex-shrink-0 w-full max-w-sm bg-base-100">
          <div className="form-control my-3">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Stato</span>
              <input
                type="checkbox"
                checked={formState.stato}
                className="checkbox checkbox-secondary"
                name="stato"
                onChange={(e) =>
                  handleChange({
                    target: { name: e.target.name, value: e.target.checked },
                  })
                }
              />
            </label>
          </div>
          <div className="form-control my-2">
            <label className="label">
              <span className="label-text">Nome</span>
            </label>
            <input
              placeholder="Nome"
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              placeholder="Email"
              type="text"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Telefono</span>
            </label>
            <input
              placeholder="Telefono"
              type="text"
              name="phone_number"
              value={formState.phone_number}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Sito Web</span>
            </label>
            <input
              placeholder="Sito Web"
              type="text"
              name="website"
              value={formState.website}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Analytics Property ID</span>
            </label>
            <input
              placeholder="Analytics Property ID"
              type="text"
              name="property"
              value={formState.property}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Facebook Account ID</span>
            </label>
            <input
              placeholder="Facebook Account ID"
              type="text"
              name="facebookid"
              value={formState.facebookid}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Note</span>
            </label>
            <textarea
              name="notes"
              className="textarea textarea-bordered"
              placeholder="Note"
              value={formState.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-control my-2 mt-6 flex flex-row gap-5 justify-between">
            <button type="submit" className="btn btn-success text-white btn-sm">
              Salva
            </button>
            <button
              type="button"
              className="btn btn-error text-white btn-sm"
              onClick={onClose}
            >
              Annula
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ClientiForm;
