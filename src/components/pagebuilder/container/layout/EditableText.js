'use client'
import React, { useEffect, useState } from 'react';
import RgEditor from '../Editor';
import { FileEdit, Save } from 'lucide-react';

const EditableText = ({ initialText, tagType, className, handleEditableTextChange, textKey, inside }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(initialText);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleTextChange = (e, htmlContent) => {

        setEditedText(htmlContent);
    };

    const handleBlur = () => {
        setIsEditing(false);
        handleEditableTextChange(textKey, editedText);
    };

    useEffect(() => {
        setEditedText(initialText);
    }, [initialText]);

    return (
        <div className="group relative hover:border-[1px] border-dashed border-slate-900">
            <div
                className="hidden group-hover:flex absolute right-[-15px] top-[-15px] bg-slate-600 p-1 text-white rounded-md cursor-pointer"
                onClick={() => {
                    handleEditableTextChange(textKey, editedText)
                    setIsEditing(!isEditing)
                }}
            >
                {isEditing ? <Save size={16} strokeWidth={1.5} /> : <FileEdit size={16} strokeWidth={1.5} />}
            </div>
            {isEditing ? (
                <div className={`block w-auto bg-transparent outline-none ${className}`}>
                    <RgEditor
                        onEditChange={handleTextChange}
                        content={editedText}
                    />
                </div>
            ) : (
                React.createElement(
                    tagType,
                    {
                        onDoubleClick: handleDoubleClick,
                        className: className,
                        dangerouslySetInnerHTML: {
                            __html: inside ? `<b>${inside}</b>` + editedText : editedText,
                        }
                    },

                )
            )}
        </div>
    );
};

export default EditableText;
