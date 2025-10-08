export interface TableType {
  id: number;
  userId: number;
  name: string;
  createdAt: string; // добавляем поле createdAt
}

export async function getTables(userId: string): Promise<TableType[]> {
  const res = await fetch(`/api/table/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();

  if (data.message === "Missing access token") {
    window.location.replace('/get-token');
    return [];
  }

  if (!res.ok || !data.result) {
    throw new Error(data.message || 'Не удалось получить таблицы');
  }

  // Сортируем по createdAt по возрастанию (старые в начале, новые в конце)
  const sortedTables = data.result.sort(
    (a: TableType, b: TableType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return sortedTables;
}
