export async function deleteItem(itemId: number): Promise<void> {

  const res = await fetch(`/api/item/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Не удалось удалить таблицу');
  }

  console.log(`Таблица с id=${itemId} успешно удалена`);
}

