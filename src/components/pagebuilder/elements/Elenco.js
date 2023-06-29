import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RgEditor from "../container/Editor";

const Elenco = ({ content, onTodosChange, isEdit, ...props }) => {
  const [todos, setTodos] = useState(content);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  }, [isEdit]);

  useEffect(() => {
    // Call the onTodosChange prop whenever the todos array changes
    onTodosChange(todos);
  }, [todos, onTodosChange]);

  const handleInputChange = (e) => {
    console.log(content);
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
      };

      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleEditStart = (id, text) => {
    setEditingId(id);
    setEditingValue(text);
  };

  const handleEditChange = (newval, htmlContent) => {
    setEditingValue(htmlContent);
  };

  const handleEditSave = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text: editingValue,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
    setEditingId(null);
    setEditingValue("");
    onTodosChange(updatedTodos);
  };
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragEnd = (result) => {
    setDraggingIndex(null);
    if (!result.destination) return;

    const updatedTodos = Array.from(todos);
    const [reorderedTodo] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedTodo);

    setTodos(updatedTodos);
  };
  const handleDragStart = (start) => {
    const { source } = start;
    setDraggingIndex(source.index);
  };

  return (
    <div className="">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId={props.dropid}>
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`list-disc ${isEdit ? "" : "ml-5"}`}
            >
              {todos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                  isDragDisabled={isEditMode}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        background: snapshot.isDragging ? "lightblue" : "",
                      }}
                      className={`${
                        isEdit
                          ? "flex flex-row items-start justify-start bg-slate-200 p-2 m-1 border-dashed border border-slate-800"
                          : ""
                      }`}
                    >
                      <div className="flex flex-row mr-2">
                        {isEdit && (
                          <>
                            {editingId === todo.id && (
                              <button
                                className="text-black text-xs font-bold py-1 px-1 hover:bg-slate-700 hover:text-white"
                                onClick={() => handleEditSave(todo.id)}
                              >
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  ariaHidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              className="text-black text-xs font-bold py-1 px-1 hover:bg-slate-700 hover:text-white"
                              onClick={() =>
                                handleEditStart(todo.id, todo.text)
                              }
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
                              onClick={() => handleDeleteTodo(todo.id)}
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
                          </>
                        )}
                      </div>
                      <div>
                        {editingId === todo.id ? (
                          <RgEditor
                            onEditChange={handleEditChange}
                            content={editingValue}
                          />
                        ) : (
                          <span
                            className="font-light text-sm"
                            dangerouslySetInnerHTML={{ __html: todo.text }}
                          ></span>
                        )}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {isEdit && (
        <>
          <h1>Elenco</h1>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Aggiungi punto"
          />
          <button onClick={handleAddTodo}>+</button>
        </>
      )}
    </div>
  );
};

export default Elenco;
