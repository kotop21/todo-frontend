import { useState } from 'react';
import { addItem } from '../../api/items/add-item';

export function useAddItem() {
  const [loading, setLoading] = useState(false);

  const add = async (tableId: number, itemName: string): Promise<void> => {
    if (!itemName.trim()) throw new Error('Название предмета не может быть пустым');

    setLoading(true);
    try {
      const res = await addItem(tableId, itemName);
      return;
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка при добавлении предмета');
    } finally {
      setLoading(false);
    }
  };

  return { add, loading };
}
