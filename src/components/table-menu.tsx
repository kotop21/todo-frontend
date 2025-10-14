import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { edit, loading: editLoading } = useEditTable();
  const { add, loading: addLoading } = useAddItem();
  const loading = editLoading || addLoading;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleDeleteConfirm = async () => {
    try {
      await deleteTable(tableId);
      showSnackbar('Table deleted successfully!');
      refreshTables?.();
      setDeleteDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error deleting table', 'error');
    }
  };

  const handleEditOpen = () => {
    handleCloseMenu();
    setInputValue(tableName || '');
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!inputValue.trim()) {
      showSnackbar('Table name cannot be empty', 'error');
      return;
    }
    try {
      await edit(tableId, inputValue);
      showSnackbar('Table name updated successfully!');
      refreshTables?.();
      setEditDialogOpen(false);
    } catch (err: any) {
      showSnackbar(err.message || 'Error updating table name', 'error');
    }
  };

  const handleAddOpen = () => {
    handleCloseMenu();
    setInputValue('');
    setAddDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!inputValue.trim()) {
      showSnackbar('Item name cannot be empty', 'error');
      return;
    }
    try {
      await add(tableId, inputValue);
      showSnackbar('Item added successfully!');
      refreshTables?.();
      setAddDialogOpen(false);
    } catch (err: any) {
      showSnackbar(err.message || 'Error adding item', 'error');
    }
  };

  const menuOptions: { label: string; icon: React.ReactNode; action: () => void }[] = [
    { label: 'Edit Table Name', icon: <EditIcon fontSize="small" />, action: handleEditOpen },
    { label: 'Delete Table', icon: <DeleteIcon fontSize="small" />, action: () => { handleCloseMenu(); setDeleteDialogOpen(true); } },
    { label: 'Add Item', icon: <AddIcon fontSize="small" />, action: handleAddOpen },
  ];

  return (
    <>
      <IconButton
        aria-label="table menu"
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
        PaperProps={{
          style: { maxHeight: ITEM_HEIGHT * 4.5, width: '210px' },
        }}
        MenuListProps={{
          'aria-labelledby': `menu-button-${tableId}`,
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem key={option.label} onClick={option.action}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Edit Table Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Table Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Table Name"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} disabled={loading}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the table "{tableName || tableId}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar with Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
