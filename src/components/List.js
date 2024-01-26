"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import PreventivoModal from "./preventivo_elements/PreventivoModal";
import { useSession } from "next-auth/react";
import { PlusIcon } from "lucide-react";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const monthIndex = date.getMonth();
  const monthNames = [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ];
  const month = monthNames[monthIndex];
  const year = String(date.getFullYear()).substr(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (
    <>
      <span className="text-xs">
        {day} {month} {year} -{" "}
      </span>
      <span className="text-xs">
        {hours}:{minutes}
      </span>
    </>
  );
}

const SelectFilters = ({ title, items, handleCheckboxChange, onAddCategory }) => {

  const [newCategory, setNewCategory] = useState('');

  const handleAddClick = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory);
      setNewCategory(''); // Reset the input field after adding
    }
  };

  return (
    <>
      <details className="dropdown">
        <summary className="btn btn-primary m-1 btn-xs text-white">{title}</summary>
        <div className="menu dropdown-content z-[1] rounded-box card card-compact w-64 p-2 shadow bg-white text-primary-content">
          <div className="form-control bg-white">
            {items &&
              items.map((item, index) => (
                <div key={index} className="cursor-pointer label">
                  <span className="label-text">{item.name}</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    value={item[title.toLowerCase()]}
                    onChange={(e) =>
                      handleCheckboxChange(
                        title.toLowerCase(),
                        item[title.toLowerCase()],
                        e.target.checked
                      )
                    }
                  />
                </div>
              ))}

            {title === 'categorie' && <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="input input-bordered input-xs flex-1 text-black"
                placeholder="Aggiungi categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button className="btn btn-xs btn-success" onClick={handleAddClick}><PlusIcon size={14} className="text-white" /></button>
            </div>}
          </div>
        </div>
      </details>


    </>

  );
};

const List = ({ columns, items, refresh, setRefresh }) => {
  const [search, setSearch] = useState("");
  const [addedCat, setAddedCat] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const [sort, setSort] = useState({ field: "", order: "asc" });
  const { data: session } = useSession();

  const [selects, setSelects] = useState([]);

  const fetchselects = async () => {
    const res = await fetch("/api/preventivi/select");
    const data = await res.json();
    setSelects(data);
  };

  const addCategory = async (title) => {
    const res = await fetch("/api/preventivi/categories", {
      method: "POST",
      headers: {
        authorization: `bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ title }), // Assuming you are sending the title in the body
    });
    const data = await res.json();

    if (data && data.message === "Data saved successfully") {
      setAddedCat(true); // Set addedCat to true to trigger the useEffect
    }
  };

  useEffect(() => {
    fetchselects();
    setAddedCat(false); // Reset addedCat to allow for subsequent additions
  }, [addedCat]);

  const [selectedItems, setSelectedItems] = useState({
    clienti: [],
    categorie: [],
  });

  const handleCheckboxChange = (filterType, id, isChecked) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [filterType]: isChecked
        ? [...prevState[filterType], id]
        : prevState[filterType].filter((itemId) => itemId !== id),
    }));
  };

  useEffect(() => {
    const filterItemsByCheckbox = () => {
      return items.filter(
        (item) =>
          (selectedItems.clienti.length === 0 ||
            selectedItems.clienti.includes(item.cliente)) &&
          (selectedItems.categorie.length === 0 ||
            selectedItems.categorie.includes(item.categoria))
      );
    };

    setFilteredItems(filterItemsByCheckbox());
  }, [selectedItems, items]);

  useEffect(() => {
    const filterItems = (searchTerm) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return items.filter(
        (item) =>
          item.id.toString().includes(lowerSearchTerm) ||
          item.title.toLowerCase().includes(lowerSearchTerm) ||
          item.client_name.toLowerCase().includes(lowerSearchTerm)
      );
    };

    setFilteredItems(filterItems(search));
  }, [search, items]);

  useEffect(() => {
    const sortItems = (field, order) => {
      const sortedItems = [...filteredItems].sort((a, b) => {
        if (field === "id" || field === "totale" || field === "state") {
          return order === "asc" ? a[field] - b[field] : b[field] - a[field];
        } else if (field === "created" || field === "updated") {
          const dateA = new Date(a[`${field}`]).getTime();
          const dateB = new Date(b[`${field}`]).getTime();
          return order === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          return order === "asc"
            ? a[field].localeCompare(b[field])
            : b[field].localeCompare(a[field]);
        }
      });

      setFilteredItems(sortedItems);
    };

    if (sort.field) {
      sortItems(sort.field, sort.order);
    }
  }, [sort]);

  const handleSort = (field) => {
    setSort((prevSort) => {
      const newOrder =
        prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc";
      return { field, order: newOrder };
    });
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [preventivoToEdit, setPreventivoToEdit] = useState(null);

  const handleOpenModal = (preventivo) => {
    setPreventivoToEdit(preventivo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setPreventivoToEdit(null);
    setModalOpen(false);
  };

  const handleSave = (formData) => {
    // Save your data here...
    fetch("/api/preventivi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Here you can handle the response, like closing the modal, showing a success message, etc.
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Here you can handle errors, like showing an error message, etc.
      });

    console.log(formData);
    handleCloseModal();
  };

  const handleDelete = (id) => {
    fetch("/api/preventivi", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Here you can handle the response, like closing the modal, showing a success message, etc.
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Here you can handle errors, like showing an error message, etc.
      });
  };

  const handleDuplicate = (id) => {
    fetch("/api/preventivi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({
        id: id,
        duplicate: true
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Here you can handle the response, like closing the modal, showing a success message, etc.
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Here you can handle errors, like showing an error message, etc.
      });
  };

  const handleState = (id, state) => {
    fetch("/api/preventivi", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ id: id, state: !state }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Here you can handle the response, like closing the modal, showing a success message, etc.
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Here you can handle errors, like showing an error message, etc.
      });
  };

  let euro = Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="indicator p-2 items-center ">
          <span className="indicator-item indicator-start badge badge-secondary z-0">
            Filtri
          </span>
          <input
            type="text"
            placeholder="🔍 Cerca..."
            className="input input-bordered input-xs max-w-xs m-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {selects[0] && (
            <SelectFilters
              title="clienti"
              items={selects[0]}
              handleCheckboxChange={handleCheckboxChange}
            />
          )}
          {selects[1] && (
            <SelectFilters
              title="categorie"
              items={selects[1]}
              handleCheckboxChange={handleCheckboxChange}
              onAddCategory={addCategory}
            />
          )}
        </div>
        {selects[0] && (
          <PreventivoModal
            className="place-self-end"
            onClick={() => handleOpenModal(null)}
            isOpen={isModalOpen}
            onSave={handleSave}
            onClose={handleCloseModal}
            preventivo={preventivoToEdit}
            clients={selects[0]}
            categories={selects[1]}
          />
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="dark:bg-gray-700">
            <tr className="text-left">
              <th className="text-center">🛠</th>
              {columns.map((column, index) => {
                switch (column) {
                  case "id":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("id")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Titolo":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("title")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Data creazione":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("created")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Stato":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("state")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Totale":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("totale")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Cliente":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("client_name")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Categoria":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("category_name")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  case "Data ultima modifica":
                    return (
                      <th
                        className="p-3 cursor-pointer"
                        key={index}
                        onClick={() => handleSort("updated")}
                      >
                        {column}
                      </th>
                    );
                    break;
                  default:
                    return (
                      <th className="p-3" key={index}>
                        {column}
                      </th>
                    );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              return (
                <tr
                  className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900"
                  key={item.id}
                >
                  <td className="p-3 text-center">
                    {selects[0] && (
                      <PreventivoModal
                        className="place-self-end"
                        onClick={() => handleOpenModal(null)}
                        isOpen={isModalOpen}
                        onSave={handleSave}
                        onClose={handleCloseModal}
                        preventivo={item}
                        clients={selects[0]}
                        categories={selects[1]}
                      />
                    )}
                    <Link href={`/preventivi/${item.slug}`} className="ml-2">
                      ✍️
                    </Link>
                    <span
                      onClick={() => handleDelete(item.id)}
                      className="ml-2 cursor-pointer"
                    >
                      🗑️
                    </span>
                    <span
                      onClick={() => handleDuplicate(item.id)}
                      className="ml-2 cursor-pointer">
                      👯
                    </span>
                  </td>
                  <td
                    onClick={() => handleState(item.id, item.state)}
                    className="p-3 text-left"
                  >
                    <span className="px-3 py-1 font-semibold rounded-md dark:bg-violet-400 dark:text-gray-900 cursor-pointer">
                      <span
                        className={`indicator-item indicator-middle indicator-center badge ${item.state == 1 ? "badge-success" : "badge-error"
                          }`}
                      ></span>
                    </span>
                  </td>

                  <td className="p-3 text-xs">{item.id}</td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 text-sm">
                    💃🏽{" "}
                    <span className="badge badge-success text-white">
                      {euro.format(item.totale)}
                    </span>
                    🕺🏽
                  </td>
                  <td className="p-3" data-cliente={item.cliente}>
                    {item.client_name}
                  </td>
                  <td className="p-3" data-category={item.categoria}>
                    {item.category_name}
                  </td>
                  <td className="p-3">{item.note}</td>
                  <td className="p-3">🕐 {formatDate(item.updated)}</td>
                  <td className="p-3">🕐 {formatDate(item.created)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
