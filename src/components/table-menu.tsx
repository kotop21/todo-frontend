import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { deleteTable } from '../api/tables/delete-tables';
import { useEditTable } from '../hooks/menu/use-edit-table';
import { useAddItem } from '../hooks/menu/use-add-item';

interface TableMenuProps {
  tableId: number;
  tableName?: string;
  refreshTables?: () => void;
}

const ITEM_HEIGHT = 48;

export default function TableMenu({ tableId, tableName, refreshTables }: TableMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { edit, loading: editLoading } = useEditTable();
  const { add, loading: addLoading } = useAddItem();
  const loading = editLoading || addLoading;

  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Удаление таблицы
  const handleDelete = async () => {
    handleCloseMenu();
    if (!confirm(`Вы уверены, что хотите удалить таблицу "${tableName || tableId}"?`)) return;
    try {
      await deleteTable(tableId);
      showSnackbar('Таблица успешно удалена!');
      refreshTables?.();
    } catch (err: any) {
      console.error(err);
      showSnackbar('Ошибка при удалении таблицы');
    }
  };

  // Редактирование таблицы
  const handleEditOpen = () => {
    handleCloseMenu();
    setInputValue(tableName || '');
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await edit(tableId, inputValue);
      showSnackbar('Название таблицы успешно изменено!');
      refreshTables?.();
      setEditDialogOpen(false);
    } catch (err: any) {
      showSnackbar(err.message || 'Ошибка при редактировании таблицы');
    }
  };

  // Добавление предмета
  const handleAddOpen = () => {
    handleCloseMenu();
    setInputValue('');
    setAddDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      await add(tableId, inputValue);
      showSnackbar('Предмет успешно добавлен!');
      refreshTables?.();
      setAddDialogOpen(false);
    } catch (err: any) {
      showSnackbar(err.message || 'Ошибка при добавлении предмета');
    }
  };

  const menuOptions: { label: string; icon: JSX.Element; action: () => void }[] = [
    { label: 'Edit Table', icon: <EditIcon fontSize="small" />, action: handleEditOpen },
    { label: 'Delete Table', icon: <DeleteIcon fontSize="small" />, action: handleDelete },
    { label: 'Add Item', icon: <AddIcon fontSize="small" />, action: handleAddOpen },
  ];

  const snackbarAction = (
    <>
      <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
        Закрыть
      </Button>
      <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <IconButton
        aria-label="more"
        id={`menu-button-${tableId}`}
        aria-controls={open ? `menu-${tableId}` : undefined}
        aria-haspopup="true"
        onClick={handleClickMenu}
        sx={{ color: '#ffffff' }}
        disabled={loading}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={`menu-${tableId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: '200px' } }}
        MenuListProps={{ 'aria-labelledby': `menu-button-${tableId}` }}
      >
        {menuOptions.map((option) => (
          <MenuItem key={option.label} onClick={option.action}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Диалог редактирования таблицы */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактировать название таблицы</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название таблицы"
            type="text"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEditSubmit(); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleEditSubmit} disabled={loading}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления предмета */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Добавить предмет</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название предмета"
            type="text"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddSubmit} disabled={loading}>Добавить</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={snackbarAction}
      />
    </>
  );
}
