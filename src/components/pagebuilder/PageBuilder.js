/*
TODO:
 - fix the edit button
 - fix the load when the data is fetching and when thers no data on api
 - add delete component functionality

 - layout standard components
  - sidebar:
    - intestazione
    - logo cliente
    - dettaglio servizi offerti
    - footer contatti swi
  - main
    - intestazione
    - titolo
    - componenti per modellare il contenuto

  - refine the structure and the menus

*/
"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import axios from "axios";
import { Button, Titoli, Totale, Paragrafo, Elenco } from "./elements";
import PageLayout from "./container/layout";
import { IncrementalCache } from "next/dist/server/lib/incremental-cache";

const ComponentRenderer = ({ item, index, innerListItems, isEdit }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(item.content);
  let mycontent = item.content;
  //console.log(item);
  if (item.type === "elenco") {
    mycontent = "";
  }

  const [todos, setTodos] = useState(item.content);

  const handleTodosChange = (newTodos) => {
    setTodos(newTodos);
    setContent(newTodos);
    item.content = newTodos;
  };

  const [edits, setEdits] = useState(item.content);

  const handleEditsChange = (newEdits) => {
    setEdits(newEdits);
    setContent(newEdits);
    item.content = newEdits;
  };

  // const [paragrafo, setPparagrafo] = useState(item.content);

  // const handleTitleChange = (newTitle) => {
  //   setTitle(newTitle);
  //   setContent(newTitle);
  //   item.content = newTitle;
  // };

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(mycontent))
  );

  const handleEditorStateChange = (newState) => {
    setEditorState(newState);
  };

  const saveContent = () => {
    const newContent = stateToHTML(editorState.getCurrentContent());
    setContent(newContent);
    item.content = newContent;
    setIsEditMode(false);
  };

  const renderComponent = () => {
    // if (isEditMode) {
    //   return (
    //     <div>
    //       {editorState && (
    //         <Editor
    //           editorState={editorState}
    //           toolbarClassName="toolbarClassName"
    //           wrapperClassName="wrapperClassName"
    //           editorClassName="editorClassName"
    //           onEditorStateChange={handleEditorStateChange}
    //         />
    //       )}
    //       <button
    //         className="bg-green-500 text-white font-bold py-1 px-2 rounded mt-2"
    //         onClick={saveContent}
    //       >
    //         Save
    //       </button>
    //     </div>
    //   );
    // }
    switch (item.type) {
      case "button":
        return (
          <Button
            content={content}
            icon={
              <svg
                className="-ml-0.5 mr-1.5 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
          />
        );
      case "title":
        return (
          <Titoli
            content={edits}
            isEdit={isEdit}
            onSaveEdits={handleEditsChange}
          />
        );
      case "paragrafo":
        return (
          <Paragrafo
            content={edits}
            isEdit={isEdit}
            onSaveEdits={handleEditsChange}
          />
        );
      case "elenco":
        return (
          <Elenco
            content={todos}
            onTodosChange={handleTodosChange}
            dropid={item.id}
            isEdit={isEdit}
          />
        );
      case "totale":
        return <Totale content={content} />;
      case "hero":
        return (
          <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-8 rounded">
            <h2
              className="text-3xl font-semibold text-white"
              dangerouslySetInnerHTML={{ __html: content }}
            ></h2>
          </div>
        );
      case "image":
        return (
          <img
            className="w-48 h-32 object-cover rounded"
            src="https://via.placeholder.com/300"
            alt={item.content}
          />
        );
      case "link":
        return (
          <a
            className="text-blue-600 hover:text-blue-800"
            href="#"
            dangerouslySetInnerHTML={{ __html: content }}
          ></a>
        );
      case "textarea":
        return (
          <textarea
            className="border rounded p-2 w-full"
            placeholder={item.content}
          ></textarea>
        );
      case "container":
        return (
          <Droppable
            droppableId={`container-${item.id}`}
            direction="horizontal"
            isDropDisabled={false}
          >
            {(provided, snapshot) => (
              <div
                className={`w-2/12 p-[1px] min-h-[60px] rounded-sm space-y-2 border-[1px] border-dashed ${
                  snapshot.isDraggingOver
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {item.items &&
                  item.items.map((innerItem, innerIndex) => (
                    <Draggable
                      key={innerItem.id}
                      draggableId={innerItem.id}
                      index={innerIndex}
                    >
                      {(provided) => (
                        <div
                          className=""
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ComponentRenderer
                            item={innerItem}
                            innerListItems={innerListItems}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        );
      default:
        return null;
    }
  };

  return (
    <div onDoubleClick={() => setIsEditMode(true)}>{renderComponent()}</div>
  );
};

const reusableComponents = [
  {
    category: "Pagine",
    pages: [
      { id: "1", title: "BRAND IDENTITY & BRAND PROTECTION", items: [] },
      { id: "2", title: "SITO WEB: SVILUPPO & ASSISTENZA TECNICA", items: [] },
      {
        id: "3",
        title: "SEO",
        subtitle: "Search Engine Optimization",
        items: [],
      },
      { id: "4", title: "SEM", subtitle: "Search Engine Marketing", items: [] },
      { id: "5", title: "DEM", subtitle: "Direct Email Marketing", items: [] },
      { id: "6", title: "SOCIAL", subtitle: "NETWORK", items: [] },
    ],
  },
  {
    category: "Componenti Editor",
    components: [
      //{ id: "7", type: "button", title: "Button", content: "Button" },
      { id: "8", type: "title", title: "Title", content: "Title" },
      // { id: "9", type: "hero", title: "Hero Section", content: "Hero Section" },
      // { id: "10", type: "image", title: "Image", content: "Image" },
      // { id: "11", type: "link", title: "Link", content: "Link" },
      // { id: "12", type: "textarea", title: "Textarea", content: "Textarea" },
      // {
      //   id: "13",
      //   type: "container",
      //   title: "Container",
      //   content: "",
      //   items: [],
      // },
      {
        id: "16",
        type: "paragrafo",
        title: "Paragrafo",
        content:
          "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal",
      },
      {
        id: "17",
        type: "elenco",
        title: "Elenco",
        content: [
          {
            id: 1,
            text: "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa",
          },
          {
            id: 2,
            text: "Lorem Ipsum è un testo segnaposto utilizzato nel settore",
          },
        ],
      },
      {
        id: "18",
        type: "totale",
        title: "Totale",
        content: "Totale",
      },
    ],
  },
  {
    category: "Preimpostati",
    components: [
      { id: "14", type: "gallery", title: "Carousel", content: "Carousel" },
      { id: "15", type: "form", title: "Form", content: "Form" },
    ],
  },
];

const getAllComponents = (reusableComponents) => {
  const components = reusableComponents
    .filter((item) => item.components) // Filter items with a components property
    .map((item) => item.components) // Extract the components arrays
    .flat(); // Flatten the arrays into a single array

  return components;
};

const removeNestedItemById = (id, items) => {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.items && item.items.length > 0) {
        return { ...item, items: removeNestedItemById(id, item.items) };
      }
      return item;
    });
};

const PageBuilder = ({ quote_id }) => {
  const [CurrentPage, setCurrentPage] = useState(1);
  const [isChildDragging, setIsChildDragging] = useState(false);
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    if (editingId) {
      setIsChildDragging(true);
    } else {
      setIsChildDragging(false);
    }
  }, [editingId]);

  const [columns, setColumns] = useState({
    pages: [
      { id: "1", title: "BRAND IDENTITY & BRAND PROTECTION", items: [] },
      { id: "2", title: "SITO WEB: SVILUPPO & ASSISTENZA TECNICA", items: [] },
      {
        id: "3",
        title: "SEO",
        subtitle: "Search Engine Optimization",
        items: [],
      },
      { id: "4", title: "SEM", subtitle: "Search Engine Marketing", items: [] },
      { id: "5", title: "DEM", subtitle: "Direct Email Marketing", items: [] },
      { id: "6", title: "SOCIAL", subtitle: "NETWORK", items: [] },
    ],
    sidebar: {
      id: "sidebar",
      // items: reusableComponents.map((category) =>
      // category.components ? category.components.map((component) => component) : category.pages.map((page) => page)
      // )[0],
      items: getAllComponents(reusableComponents),
    },
    pageArea: {
      id: "pageArea",
      items: [],
    },
  });

  const EditMenu = ({ children, itemId, columns, editingId, setEditingId }) => {
    const [isHover, setIsHover] = useState(false);

    const isEdit = itemId === editingId;

    const childrenWithProps = React.Children.map(children, (child) => {
      // Checking isValidElement is the safe way and avoids a TS error too.
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { isEdit, setIsEdit: setEditingId });
      }
      return child;
    });

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isHover && (
          <div
            className="absolute top-0 right-0 bg-gray-100 flex flex-row align-middle justify-center"
            editid={itemId}
          >
            <button
              className="text-black text-xs font-bold py-1 px-1 hover:bg-slate-700 hover:text-white"
              onClick={() => {
                console.log("edit", itemId);
                setEditingId(isEdit ? null : itemId);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
            <button
              className="text-black text-xs font-bold py-1 px-1 hover:bg-slate-700 hover:text-white"
              onClick={() => {
                console.log("delete", itemId);
                handleRemoveItem(itemId);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        )}
        {childrenWithProps}
      </div>
    );
  };

  function removeItemById(items, itemId) {
    return items
      .map((item) => {
        if (item.id === itemId) {
          return null;
        }

        if (item.items) {
          const updatedNestedItems = removeItemById(item.items, itemId);
          return {
            ...item,
            items: updatedNestedItems.filter((i) => i !== null),
          };
        }

        return item;
      })
      .filter((item) => item !== null);
  }

  function handleRemoveItem(itemId) {
    setColumns((prevColumns) => {
      // Filter out the item with the specified ID, including nested items
      const updatedItems = removeItemById(prevColumns.pageArea.items, itemId);

      // Update the columns state with the new items array
      return {
        ...prevColumns,
        pageArea: {
          ...prevColumns.pageArea,
          items: updatedItems,
        },
      };
    });
  }

  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const comps = getAllComponents(reusableComponents);
    columns.sidebar.items = comps;

    console.log("Use me", columns);
    if (saveData) {
      const saveToDatabase = async () => {
        try {
          console.log(columns);
          const response = await axios.post("/api/pagebuilder/save", {
            page_id: quote_id,
            data: columns,
          });
          console.log(response.data);
          setSaveData(false); // Reset the saveData state after saving
        } catch (error) {
          console.error("Error saving page:", error);
        }
      };

      saveToDatabase();

      console.log("Updated columns:", columns);
    }
  }, [saveData, columns]);

  function handleCurrentPage(id) {
    // load pageArea with the selected page
    setCurrentPage(id);
    console.log("current page: ", id);
  }

  useEffect(() => {
    console.log(CurrentPage);
    setColumns((prevColumns) => {
      const updatedPages = prevColumns.pages.find((page) => {
        return Number(page.id) === Number(CurrentPage);
      });

      // Check if the updatedPages is found
      const updatedPageItems = updatedPages ? updatedPages.items : [];
      console.log(updatedPageItems);

      return {
        ...prevColumns,
        pageArea: {
          id: "pageArea",
          items: updatedPageItems,
        },
      };
    });

    console.log("columns: ", columns);
  }, [CurrentPage]);

  const savePage = () => {
    setColumns((prevColumns) => {
      // Update the pages array
      const updatedPages = prevColumns.pages.map((page) => {
        if (Number(page.id) === Number(CurrentPage)) {
          return { ...page, items: columns.pageArea.items };
        }
        return page;
      });

      return {
        ...prevColumns,
        pages: updatedPages,
      };
    });
    setSaveData(true);
  };

  const loadPage = async () => {
    try {
      const response = await axios.get("/api/pagebuilder/getone", {
        params: {
          page_id: quote_id,
        },
      });

      if (response.data.pageArea.items.length > 0) {
        const newCols = response.data;
        newCols.pageArea = response.data.pages[0];
        setColumns(newCols);
      }
    } catch (error) {
      console.error("Error loading page:", error);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getInnerListItems = () => {
    if (!columns.pageArea || !columns.pageArea.items) {
      return {};
    }
    return columns.pageArea.items.reduce((acc, item) => {
      if (item.type === "container") {
        acc[item.id] = item.items || [];
      }
      return acc;
    }, {});
  };

  const innerListItems = getInnerListItems();

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const insertItemIntoContainer = (itemId, itemToInsert, index, items) => {
      return items.map((item) => {
        if (item.id === itemId) {
          const newItems = item.items ? [...item.items] : [];
          newItems.splice(index, 0, itemToInsert);
          return { ...item, items: newItems };
        }
        if (item.items && item.items.length > 0) {
          return {
            ...item,
            items: insertItemIntoContainer(
              itemId,
              itemToInsert,
              index,
              item.items
            ),
          };
        }
        return item;
      });
    };

    function findItemById(obj, id) {
      if (obj.id === id) {
        return obj;
      }
      if (obj.items) {
        for (let item of obj.items) {
          let result = findItemById(item, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    }

    if (
      source.droppableId === "sidebar" &&
      destination.droppableId.includes("container")
    ) {
      console.log("droping in container from sidebar");
      // Copying items from the sidebar to a container
      const sourceItems = Array.from(columns[source.droppableId].items);
      const destinationContainerId = destination.droppableId.replace(
        "container-",
        ""
      );

      const sourceItem = sourceItems.find(
        (item) => Number(item.id) === source.index
      );
      const copiedItem = { ...sourceItem, id: uuidv4() };

      console.log("copied: ", copiedItem);

      // Insert the moved item into the destination container
      const updatedItems = insertItemIntoContainer(
        destinationContainerId,
        copiedItem,
        destination.index,
        columns.pageArea.items
      );

      setColumns((prevColumns) => ({
        ...prevColumns,
        pageArea: {
          ...prevColumns.pageArea,
          items: updatedItems,
        },
      }));
    } else if (
      source.droppableId.includes("sidebar") &&
      destination.droppableId.includes("pageArea")
    ) {
      console.log("from sidebar to pageArea");
      const sourceItems = Array.from(columns[source.droppableId].items);
      const destinationItems = Array.from(
        columns[destination.droppableId].items
      );
      const sourceItem = sourceItems.find(
        (item) => Number(item.id) === source.index
      );
      const copiedItem = { ...sourceItem, id: uuidv4() };

      destinationItems.splice(destination.index, 0, copiedItem);

      console.log(sourceItem);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [destination.droppableId]: {
          ...prevColumns[destination.droppableId],
          items: destinationItems,
        },
      }));
    } else if (
      !source.droppableId.includes("container") &&
      !destination.droppableId.includes("container")
    ) {
      console.log("Moving items within the same list (pageArea)");
      // Moving items within the same list (pageArea)
      const newItems = Array.from(columns[source.droppableId].items);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...prevColumns[source.droppableId],
          items: newItems,
        },
      }));
    } else if (
      source.droppableId.includes("container") &&
      destination.droppableId.includes("container")
    ) {
      console.log(
        "Moving items between containers or within the same container"
      );
      console.log(
        "source: " + source.droppableId,
        "destination: " + destination.droppableId
      );

      const sourceItems = Array.from(
        findItemById(
          columns.pageArea,
          source.droppableId.replace("container-", "")
        ).items
      );
      const destinationContainerId = destination.droppableId.replace(
        "container-",
        ""
      );
      const [movedItem] = sourceItems.splice(source.index, 1);

      // Remove the moved item from the source container
      const updatedItemsAfterRemoval = removeNestedItemById(
        movedItem.id,
        columns.pageArea.items
      );

      // Insert the moved item into the destination container
      const updatedItems = insertItemIntoContainer(
        destinationContainerId,
        movedItem,
        destination.index,
        updatedItemsAfterRemoval
      );

      setColumns((prevColumns) => ({
        ...prevColumns,
        pageArea: {
          ...prevColumns.pageArea,
          items: updatedItems,
        },
      }));
    } else if (
      source.droppableId.includes("pageArea") &&
      destination.droppableId.includes("container")
    ) {
      console.log("Moving items from the pageArea to a container");
      // Moving items from the pageArea to a container
      const sourceItems = Array.from(
        columns[source.droppableId.replace("container-", "")].items
      );
      const destinationContainerId = destination.droppableId.replace(
        "container-",
        ""
      );
      const [movedItem] = sourceItems.splice(source.index, 1);

      // Remove the moved item from the source container
      const updatedItemsAfterRemoval = removeNestedItemById(
        movedItem.id,
        columns.pageArea.items
      );

      // Insert the moved item into the destination container
      const updatedItems = insertItemIntoContainer(
        destinationContainerId,
        movedItem,
        destination.index,
        updatedItemsAfterRemoval
      );

      setColumns((prevColumns) => ({
        ...prevColumns,
        pageArea: {
          ...prevColumns.pageArea,
          items: updatedItems,
        },
      }));
    } else {
      console.log("from container to pageArea");

      console.log(
        "source: " + source.droppableId,
        "destination: " + destination.droppableId
      );

      const sourceItems = Array.from(
        findItemById(
          columns.pageArea,
          source.droppableId.replace("container-", "")
        ).items
      );
      //const destinationContainerId = destination.droppableId;
      const [movedItem] = sourceItems.splice(source.index, 1);

      // Remove the moved item from the source container
      const updatedItemsAfterRemoval = removeNestedItemById(
        movedItem.id,
        columns.pageArea.items
      );

      const destinationItems = Array.from(updatedItemsAfterRemoval);
      //const copiedItem = { ...sourceItems[source.index], id: uuidv4() };

      destinationItems.splice(destination.index, 0, movedItem);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [destination.droppableId]: {
          ...prevColumns[destination.droppableId],
          items: destinationItems,
        },
      }));
    }
  };

  if (!isClient) {
    return null; // Or return a loading component, if you prefer
  }

  const Sidebar = () => {
    return (
      <nav className="-mx-3 space-y-6">
        {reusableComponents.map((category) => (
          <div key={category.category} className="space-y-3">
            <label className="p-3 font-bold text-xs text-gray-500 uppercase dark:text-gray-400 bg-gray-200">
              {category.category}
            </label>
            {category.pages &&
              category.pages.map((page, index) => (
                <div
                  key={page.id}
                  onClick={() => handleCurrentPage(page.id)}
                  className="cursor-pointer flex-column items-left px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <span className="text-sm font-medium">{page.title}</span>
                  <span className=" text-xs font-light block">
                    {page.subtitle}
                  </span>
                </div>
              ))}
            {category.components &&
              category.components.map((component, index) => (
                <Draggable
                  className={index}
                  key={component.id}
                  draggableId={component.id}
                  index={Number(component.id)}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                    >
                      <span className="mx-2 text-sm font-medium">
                        {component.title}
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
          </div>
        ))}
      </nav>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
          <Droppable droppableId="sidebar" isDropDisabled={true}>
            {(provided) => (
              <>
                <h3 className="text-lg font-semibold mb-4">Components</h3>
                <div
                  className="flex flex-col justify-between flex-1 mt-6"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Sidebar />
                  {provided.placeholder}
                </div>
              </>
            )}
          </Droppable>
        </aside>
        <div className="flex-1 bg-slate-200 p-4">
          <Droppable
            droppableId="pageArea"
            direction="vertical"
            isDropDisabled={false}
          >
            {(provided, snapshot) => (
              <>
                <div className="flex flex-row justify-between items-center bg-slate-100 pl-4 mb-5">
                  <h3 className="text-lg font-semibold">
                    {
                      columns.pages.find(
                        (item) => Number(item.id) === Number(CurrentPage)
                      ).title
                    }
                  </h3>
                  <div className="flex justify-center">
                    <button
                      className="bg-green-400 text-white text-xs py-2 px-2 flex flex-row center justify-center"
                      onClick={savePage}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mr-2 w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      Save Page
                    </button>
                  </div>
                </div>
                <PageLayout>
                  <h1 className="bg-primary text-white uppercase p-3 py-2 my-6">
                    {
                      columns.pages.find(
                        (item) => Number(item.id) === Number(CurrentPage)
                      ).title
                    }
                  </h1>
                  <div
                    className={`bg-white min-h-screen w-full p-[1px] rounded-sm space-y-2 border-[1px] border-dashed  ${
                      snapshot.isDraggingOver
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {columns.pageArea &&
                      columns.pageArea.items &&
                      columns.pageArea.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={isChildDragging}
                        >
                          {(provided) => (
                            <div
                              className="cursor-move flex"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <EditMenu
                                itemId={item.id}
                                columns={columns}
                                editingId={editingId}
                                setEditingId={setEditingId}
                              >
                                <ComponentRenderer
                                  item={item}
                                  index={index}
                                  innerListItems={innerListItems}
                                />
                              </EditMenu>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </PageLayout>
              </>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

export default PageBuilder;
