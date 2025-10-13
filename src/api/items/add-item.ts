export interface ItemType {
  id: number;
  tableId: number;
  itemName: string;
}

export async function addItem(tableId: number, itemName: string): Promise<ItemType> {
  const res = await fetch(`/api/item/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ tableId, itemName }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Не удалось добавить элемент');
  }

  console.log(`Элемент ${itemName} успешно добавлен`);
}
