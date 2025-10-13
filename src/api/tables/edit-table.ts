export interface TableType {
  id: number;
  tableId: number;
  tableName: string;
}

export async function editTable(tableId: number, tableName: string): Promise<TableType[]> {

  const res = await fetch(`/api/table`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ tableId, tableName }),
  });

  const data = await res.json();

  if (data.message === "Missing access token") {
    window.location.replace('/get-token');
    return [];
  }

  if (!res.ok) {
    throw new Error(data.message || 'Не удалось отредактировать таблицы');
  }

  return data.result;
}

