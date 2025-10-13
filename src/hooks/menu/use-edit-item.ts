import { useState } from 'react';
import { editItem } from '../../api/items/edit-item'; // предполагается, что есть API для редактирования предмета

export function useEditItem() {
  const [loading, setLoading] = useState(false);

  /**
   * Редактирование предмета
   * @param itemId - ID предмета
   * @param newName - новое название
   * @param newDescrip - новое описание
   */
  const edit = async (itemId: number, newName: string, newDescrip: string) => {
    if (!newName.trim()) throw new Error('Название предмета не может быть пустым');

    setLoading(true);
    try {
      await editItem(itemId, newName, newDescrip);
    } finally {
      setLoading(false);
    }
  };

  return { edit, loading };
}

