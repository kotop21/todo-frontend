import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getTables } from '../api/get-tables';
import { getItems } from '../api/get-items';
import type { ItemType } from '../api/get-items';
import type { TableType } from '../api/get-tables';
import { useDragScroll } from '../hooks/use-drag-scroll';
import TableColumn from '../components/table-column';

export default function ToDo() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  const {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    if (!userId) {
      window.location.href = '/auth';
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tablesData, itemsData] = await Promise.all([
          getTables(userId),
          getItems(userId),
        ]);

        setTables(tablesData);
        setItems(itemsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (

    <Box
      ref={scrollRef}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        gap: 2,
        p: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        alignItems: 'flex-start',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE 10+
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Спиннер загрузки */}
      <Backdrop sx={{ color: '#fff', zIndex: 1201 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Ошибка */}
      {error && <p style={{ color: 'red', position: 'absolute', top: 0 }}>{error}</p>}

      {/* Колонки */}
      {!loading &&
        tables.length > 0 &&
        tables.map((table) => (
          <TableColumn key={table.id} table={table} items={items} />
        ))}
    </Box>
  );
}
