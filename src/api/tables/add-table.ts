export interface TableType {
  id: number;
  userId: number;
  tableName: string;
}

export async function addTable(userId: number, tableName: string): Promise<TableType> {
  const res = await fetch(`/api/table/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userId, tableName }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Не удалось добавить элемент');
  }

  console.log(`Элемент ${tableName} успешно добавлен`);
}

