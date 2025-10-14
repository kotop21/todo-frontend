import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import { useTheme } from '@mui/material/styles';
import { useEditItem } from '../hooks/menu/use-edit-item';
import { deleteItem } from '../api/items/delete-item';

export interface ItemMenuProps {
  itemId: number;
  itemName: string;
  itemDescrip?: string;
  onClose: () => void;
  refreshItems?: () => void;
}

export default function ItemMenu({
  itemId,
  itemName,
  itemDescrip,
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

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      setSnackbarMessage(err.message || 'Error deleting item');
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
      setSnackbarMessage(err.message || 'Error saving item changes');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      {/* Main View Dialog */}
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          {itemName}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {itemDescrip ? (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
              {formattedDescrip}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No description provided.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
          <Button onClick={onClose}>Close</Button>
          <Button variant="contained" onClick={handleEditOpen}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              autoFocus
              label="Item Name"
              type="text"
              fullWidth
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Description"
              type="text"
              fullWidth
              multiline
              minRows={4}
              maxRows={12}
              value={descripValue.split('\\n').join('\n')}
              onChange={(e) => setDescripValue(e.target.value)}
              helperText="You can use line breaks for better formatting."
              variant="outlined"
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            disabled={loading || !nameValue.trim()}
            variant="contained"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
