import { useState } from 'react';
import { editTable } from '../../api/tables/edit-table';

export function useEditTable() {
  const [loading, setLoading] = useState(false);

  const edit = async (tableId: number, newName: string): Promise<void> => {
    if (!newName.trim()) throw new Error('Название таблицы не может быть пустым');

    setLoading(true);
    try {
      const res = await editTable(tableId, newName);
      return;
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка при редактировании таблицы');
    } finally {
      setLoading(false);
    }
  };

  return { edit, loading };
}
