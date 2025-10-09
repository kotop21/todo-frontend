export async function editItem(itemId: number, itemName: string, itemDescrip: string) {
  const res = await fetch(`/api/item/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ itemId, itemName, itemDescrip }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Не удалось отредактировать предмет');
  }

  console.log(`Предмет "${itemName}" успешно отредактирован`);
  return data;
}

