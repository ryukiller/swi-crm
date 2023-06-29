import { useState, useEffect } from "react";
import RgEditor from "../container/Editor";

const Titoli = ({ content, isEdit, onSaveEdits, ...props }) => {
  const [editingValue, setEditingValue] = useState(content);
  const [editing, setEditing] = useState(isEdit);
  const handleEditChange = (newval, htmlContent) => {
    setEditingValue(htmlContent);
  };

  const handleEditSave = () => {
    onSaveEdits(editingValue);
    setEditing(!editing);
  };

  useEffect(() => {
    onSaveEdits(editingValue);
  }, [content, onSaveEdits]);

  return (
    <>
      {isEdit ? (
        <div className="flex flex-row items-start justify-start bg-slate-200 p-2 m-1 border-dashed border border-slate-800">
          <button
            className="text-black text-xs font-bold py-1 px-1 hover:bg-slate-700 hover:text-white"
            onClick={() => handleEditSave()}
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
          <RgEditor onEditChange={handleEditChange} content={editingValue} />
        </div>
      ) : (
        <>
          <h3
            className="text-sm font-bold my-4"
            dangerouslySetInnerHTML={{ __html: editingValue }}
          ></h3>
        </>
      )}
    </>
  );
};

export default Titoli;
