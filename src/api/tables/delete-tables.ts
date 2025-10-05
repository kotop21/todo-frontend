export interface TableType {
  id: number;
  userId: number;
  name: string;
}

export async function deleteTable(tableId: number): Promise<void> {
  const res = await fetch(`/api/table/${tableId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Не удалось удалить таблицу');
  }

  console.log(`Таблица с id=${tableId} успешно удалена`);
}
