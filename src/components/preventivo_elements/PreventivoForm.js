import { useState, useEffect } from "react";

const PreventivoForm = ({
  preventivo,
  clients,
  categories,
  onSave,
  onClose,
}) => {
  const [formState, setFormState] = useState({
    title: "",
    totale: "",
    state: 0,
    cliente: "",
    categoria: "",
    note: "",
    slug: "",
    data: "",
  });

  useEffect(() => {
    if (preventivo) {
      setFormState(preventivo);
    }
  }, [preventivo]);

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
            {preventivo ? "Modifica Preventivo" : "Crea Nuovo Preventivo"}
          </h3>
          <p className="py-2">
            {preventivo
              ? "Modifica le impostazioni base del preventivo"
              : "Crea un nuovo preventivo da mandare al cliente, qui compili le informazioni base."}
          </p>
        </div>
        <div className="flex-shrink-0 w-full max-w-sm bg-base-100">
          <div className="form-control my-3">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Stato</span>
              <input
                type="checkbox"
                checked={formState.state}
                className="checkbox checkbox-secondary"
                name="state"
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
              <span className="label-text">Titolo</span>
            </label>
            <input
              placeholder="Titolo"
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label">
              <span className="label-text">Totale</span>
            </label>
            <input
              placeholder="Totale"
              type="text"
              name="totale"
              value={formState.totale}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Cliente</span>
            </label>
            <select
              className="select select-bordered w-full"
              name="cliente"
              value={formState.cliente}
              onChange={handleChange}
              required
            >
              {clients.map((client) => (
                <option key={client.clienti} value={client.clienti}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Categoria</span>
            </label>
            <select
              className="select select-bordered w-full"
              name="categoria"
              value={formState.categoria}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category.categorie} value={category.categorie}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control my-2">
            <label className="label align-middle justify-start gap-2">
              <span className="label-text">Note</span>
            </label>
            <textarea
              name="note"
              className="textarea textarea-bordered"
              placeholder="Note"
              value={formState.note}
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

export default PreventivoForm;
