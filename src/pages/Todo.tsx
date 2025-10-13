import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import { getTables } from '../api/tables/get-tables';
import { getItems } from '../api/items/get-items';
import { addTable } from '../api/tables/add-table';
import type { ItemType } from '../api/items/get-items';
import type { TableType } from '../api/tables/get-tables';
import { useDragScroll } from '../hooks/use-drag-scroll';
import TableColumn from '../components/table-column';
import ItemMenu from '../components/item-menu';

export default function ToDo() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Для диалога добавления таблицы
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Для ItemMenu
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  const userId = localStorage.getItem('userId');

  const {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useDragScroll<HTMLDivElement>();

  const fetchTables = async () => {
    if (!userId) return;
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

  useEffect(() => {
    if (!userId) {
      window.location.href = '/auth';
      return;
    }
    fetchTables();
  }, [userId]);

  // Snackbar
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const handleCloseSnackbar = (_?: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Добавление таблицы
  const handleAddTableOpen = () => {
    setNewTableName('');
    setAddDialogOpen(true);
  };
  const handleAddTableSubmit = async () => {
    if (!newTableName.trim()) {
      showSnackbar('Название таблицы не может быть пустым');
      return;
    }
    if (!userId) return;

    try {
      await addTable(Number(userId), newTableName);
      showSnackbar(`Таблица "${newTableName}" успешно добавлена!`);
      fetchTables();
      setAddDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Ошибка при добавлении таблицы');
    }
  };

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
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
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
          <TableColumn
            key={table.id}
            table={table}
            items={items}
            refreshTables={fetchTables}
            onItemClick={(item: ItemType) => setSelectedItem(item)} // <-- вызываем ItemMenu
          />
        ))}

      {/* Плавающий плюсик */}
      <IconButton
        color="primary"
        onClick={handleAddTableOpen}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          bgcolor: 'primary.main',
          color: 'white',
          width: 60,
          height: 60,
          '&:hover': { bgcolor: 'primary.dark' },
          boxShadow: 3,
        }}
      >
        <AddIcon sx={{ fontSize: '2.5rem' }} />
      </IconButton>

      {/* Диалог добавления таблицы */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Добавить таблицу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название таблицы"
            type="text"
            fullWidth
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTableSubmit(); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddTableSubmit}>Добавить</Button>
        </DialogActions>
      </Dialog>

      {/* ItemMenu диалог */}
      {selectedItem && (
        <ItemMenu
          itemId={selectedItem.id}
          itemName={selectedItem.itemName}
          itemDescrip={selectedItem.itemDescrip}
          createdAt={selectedItem.createdAt}
          onClose={() => setSelectedItem(null)}
          refreshItems={fetchTables} // обновляем таблицы и предметы
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Закрыть
          </Button>
        }
      />
    </Box>
  );
}
