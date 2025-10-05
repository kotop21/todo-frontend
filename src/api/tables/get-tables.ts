export interface TableType {
  id: number;
  userId: number;
  name: string;
}

export async function getTables(userId: string): Promise<TableType[]> {
  const res = await fetch(`/api/table/${userId}`);
  const data = await res.json();

  if (data.message === "Missing access token") {
    window.location.replace('/get-token');
    return [];
  }

  if (!res.ok || !data.result) {
    throw new Error(data.message || 'Не удалось получить таблицы');
  }

  return data.result;
}

