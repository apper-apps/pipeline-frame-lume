import { useState, useCallback } from "react";

export const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = useCallback((e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.target.style.opacity = "0.5";
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback((e, columnTitle) => {
    e.preventDefault();
    setDragOverColumn(columnTitle);
  }, []);

  const handleDragLeave = useCallback((e) => {
    // Only clear drag over if leaving the column container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e, columnTitle, onDrop) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem && draggedItem.column !== columnTitle) {
      onDrop(draggedItem, columnTitle);
    }
    
    setDraggedItem(null);
  }, [draggedItem]);

  return {
    draggedItem,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  };
};