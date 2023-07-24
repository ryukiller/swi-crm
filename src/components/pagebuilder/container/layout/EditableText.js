import React, { useEffect, useState } from 'react';

const EditableText = ({ initialText, tagType, className, handleEditableTextChange, textKey, children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(initialText);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleTextChange = (e) => {
        setEditedText(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        handleEditableTextChange(textKey, editedText);
    };

    useEffect(() => {
        setEditedText(initialText);
    }, [initialText]);

    return (
        <>
            {isEditing ? (
                <input
                    className={className}
                    type="text"
                    value={editedText}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    autoFocus
                />
            ) : (
                React.createElement(
                    tagType,
                    {
                        onDoubleClick: handleDoubleClick,
                        className: className
                    },
                    children,
                    editedText
                )
            )}
        </>
    );
};

export default EditableText;
