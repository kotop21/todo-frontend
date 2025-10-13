import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEditItem } from '../hooks/menu/use-edit-item';
import { deleteItem } from '../api/items/delete-item';

export interface ItemMenuProps {
  itemId: number;
  itemName: string;
  itemDescrip?: string;
  createdAt: string;
  onClose: () => void;
  refreshItems?: () => void;
}

export default function ItemMenu({
  itemId,
  itemName,
  itemDescrip,
  createdAt,
  onClose,
  refreshItems,
}: ItemMenuProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nameValue, setNameValue] = useState(itemName);
  const [descripValue, setDescripValue] = useState(itemDescrip || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { edit, loading } = useEditItem();

  const formattedDescrip = descripValue.split('\\n').join('\n');

  const handleEditOpen = () => {
    setEditDialogOpen(true);
    setNameValue(itemName);
    setDescripValue(itemDescrip || '');
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteItem(itemId);
      refreshItems?.();
      setDeleteDialogOpen(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setSnackbarMessage(err.message || 'Ошибка при удалении предмета');
      setSnackbarOpen(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await edit(itemId, nameValue, descripValue.split('\n').join('\\n'));
      refreshItems?.();
      setEditDialogOpen(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setSnackbarMessage(err.message || 'Ошибка при редактировании предмета');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      {/* Основной диалог просмотра */}
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {itemName}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {itemDescrip && (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
              {formattedDescrip}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setDeleteDialogOpen(true)}>Удалить</Button>
          <Button onClick={onClose}>Закрыть</Button>
          <Button onClick={handleEditOpen}>Редактировать</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать предмет</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Название предмета"
            type="text"
            fullWidth
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Описание"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={descripValue.split('\\n').join('\n')}
            onChange={(e) => setDescripValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleEditSubmit} disabled={loading}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Вы уверены, что хотите удалить "{itemName}"? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Удалить</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для ошибок */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
