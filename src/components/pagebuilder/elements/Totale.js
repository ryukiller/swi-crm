'use client'
import { useState, useEffect } from "react";
import RgEditor from "../container/Editor";


const Totale = ({ content, isEdit, onSaveEdits, ...props }) => {

  const [editingValue, setEditingValue] = useState({ title: content.title, prezzo: content.prezzo, ivainclusa: content.ivainclusa, info: content.info });
  const [editing, setEditing] = useState(isEdit);

  const handleEditChange = (identifier, htmlContent) => {
    setEditingValue(prevState => ({ ...prevState, [identifier]: htmlContent }));
  };


  const handleEditSave = () => {
    if (onSaveEdits)
      onSaveEdits(editingValue);
    setEditing(!editing);
  };

  useEffect(() => {
    if (onSaveEdits)
      onSaveEdits(editingValue);
  }, [content, onSaveEdits]);



  return (

    <>
      {isEdit ? (
        <div className="flex flex-row items-start justify-end bg-slate-200 p-2 m-1 border-dashed border border-slate-800">
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

          <div className="flex flex-row items-center justify-between my-2">
            <div></div>
            <div className=""></div>
            <div className="flex flex-col items-end justify-start">
              <div className="flex flex-row items-center"><RgEditor onEditChange={(htmlContent) => handleEditChange('title', htmlContent)} content={editingValue.title} onlyText={true} /> : € <RgEditor onEditChange={(htmlContent) => handleEditChange('prezzo', htmlContent)} content={editingValue.prezzo} onlyText={true} /> + <RgEditor onEditChange={(htmlContent) => handleEditChange('ivainclusa', htmlContent)} content={editingValue.ivainclusa} onlyText={true} /></div>
              <p className="text-right text-xs font-light"><RgEditor onEditChange={(htmlContent) => handleEditChange('info', htmlContent)} content={editingValue.info} onlyText={true} /></p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-between my-2">
          <div></div>
          <div className=""></div>
          <div className="flex flex-col items-end justify-start">
            <div>{editingValue.title} : € {editingValue.prezzo} + {editingValue.ivainclusa}</div>
            <p className="text-right text-xs font-light">{editingValue.info}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Totale;
