export interface ItemType {
  id: number;
  tableId: number;
  userId: number;
  itemName: string;
  itemDescrip: string;
  itemDate: string;
}

export async function getItems(userId: string): Promise<ItemType[]> {
  const res = await fetch(`/api/item/${userId}`);
  const data = await res.json();

  if (data.message === "Missing access token") {
    window.location.replace('/get-token');
    return [];
  }

  if (!res.ok || !data.result) {
    throw new Error(data.message || 'Не удалось получить элементы');
  }

  return data.result;
}

