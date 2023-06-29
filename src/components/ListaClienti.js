"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ClientiModal from "./clienti_elements/ClientiModal";
import { useSession } from "next-auth/react";

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

const ListaClienti = ({ columns, items, refresh, setRefresh }) => {
    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [sort, setSort] = useState({ field: "", order: "asc" });
    const { data: session } = useSession();

    useEffect(() => {
        const filterItems = (searchTerm) => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            return items.filter(
                (item) =>
                    item.id.toString().includes(lowerSearchTerm) ||
                    item.name.toLowerCase().includes(lowerSearchTerm));
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
    const [clienteToEdit, setClienteToEdit] = useState(null);

    const handleOpenModal = (cliente) => {
        setClienteToEdit(cliente);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setClienteToEdit(null);
        setModalOpen(false);
    };

    const handleSave = (formData) => {
        // Save your data here...
        fetch("/api/clienti", {
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
        fetch("/api/clienti", {
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

    const handleState = (id, state) => {
        fetch("/api/clienti", {
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
                </div>
                <ClientiModal
                    className="place-self-end"
                    onClick={() => handleOpenModal(null)}
                    isOpen={isModalOpen}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    cliente={clienteToEdit}
                />
            </div>
            <div className="overflow-x-auto w-full">
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
                                    case "Nome":
                                        return (
                                            <th
                                                className="p-3 cursor-pointer"
                                                key={index}
                                                onClick={() => handleSort("name")}
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
                                                onClick={() => handleSort("created_at")}
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
                                    case "Telefono":
                                        return (
                                            <th
                                                className="p-3 cursor-pointer"
                                                key={index}
                                                onClick={() => handleSort("phone_number")}
                                            >
                                                {column}
                                            </th>
                                        );
                                        break;
                                    case "Sito web":
                                        return (
                                            <th
                                                className="p-3 cursor-pointer"
                                                key={index}
                                                onClick={() => handleSort("website")}
                                            >
                                                {column}
                                            </th>
                                        );
                                        break;
                                    case "Note":
                                        return (
                                            <th
                                                className="p-3 cursor-pointer"
                                                key={index}
                                                onClick={() => handleSort("notes")}
                                            >
                                                {column}
                                            </th>
                                        );
                                        break;
                                    case "Email":
                                        return (
                                            <th
                                                className="p-3 cursor-pointer"
                                                key={index}
                                                onClick={() => handleSort("email")}
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
                                                onClick={() => handleSort("updated_at")}
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
                                        <ClientiModal
                                            className="place-self-end"
                                            onClick={() => handleOpenModal(null)}
                                            isOpen={isModalOpen}
                                            onSave={handleSave}
                                            onClose={handleCloseModal}
                                            cliente={item}
                                        />
                                        <Link href={`/clienti/${item.id}`} className="ml-2">
                                            ✍️
                                        </Link>
                                        <span
                                            onClick={() => handleDelete(item.id)}
                                            className="ml-2 cursor-pointer"
                                        >
                                            🗑️
                                        </span>
                                    </td>
                                    <td
                                        onClick={() => handleState(item.id, item.stato)}
                                        className="p-3 text-left"
                                    >
                                        <span className="px-3 py-1 font-semibold rounded-md dark:bg-violet-400 dark:text-gray-900 cursor-pointer">
                                            <span
                                                className={`indicator-item indicator-middle indicator-center badge ${item.stato == 1 ? "badge-success" : "badge-error"
                                                    }`}
                                            ></span>
                                        </span>
                                    </td>

                                    <td className="p-3 text-xs">{item.id}</td>
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3" data-cliente={item.email}>
                                        {item.email}
                                    </td>
                                    <td className="p-3" data-category={item.phone_number}>
                                        {item.phone_number}
                                    </td>
                                    <td className="p-3" data-category={item.website}>
                                        {item.website}
                                    </td>
                                    <td className="p-3">{item.notes}</td>
                                    <td className="p-3">🕐 {formatDate(item.updated_at)}</td>
                                    <td className="p-3">🕐 {formatDate(item.created_at)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaClienti;
