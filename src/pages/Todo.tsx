import { useState, useEffect } from 'react';
import {
  Box,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Fab,
  Typography,
  Link,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { getTables } from '../api/tables/get-tables';
import { getItems } from '../api/items/get-items';
import { addTable } from '../api/tables/add-table';
import type { ItemType } from '../api/items/get-items';
import type { TableType } from '../api/tables/get-tables';
import { useDragScroll } from '../hooks/use-drag-scroll';
import TableColumn from '../components/table-column';
import ItemMenu from '../components/item-menu';
import Navbar from '../components/Navbar';

export default function ToDo() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  const userId = localStorage.getItem('userId');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleAddTableSubmit = async () => {
    if (!newTableName.trim()) {
      showSnackbar('Table name cannot be empty', 'error');
      return;
    }
    if (!userId) return;

    try {
      await addTable(Number(userId), newTableName);
      showSnackbar(`Table "${newTableName}" added successfully!`);
      fetchTables();
      setAddDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error adding table', 'error');
    }
  };

  useEffect(() => {
    const handleMouseDownPage = (e: MouseEvent) => handleMouseDown(e as any);
    const handleMouseMovePage = (e: MouseEvent) => handleMouseMove(e as any);
    const handleMouseUpPage = () => handleMouseUp();
    const handleMouseLeavePage = () => handleMouseLeave();

    window.addEventListener('mousedown', handleMouseDownPage);
    window.addEventListener('mousemove', handleMouseMovePage);
    window.addEventListener('mouseup', handleMouseUpPage);
    window.addEventListener('mouseleave', handleMouseLeavePage);

    return () => {
      window.removeEventListener('mousedown', handleMouseDownPage);
      window.removeEventListener('mousemove', handleMouseMovePage);
      window.removeEventListener('mouseup', handleMouseUpPage);
      window.removeEventListener('mouseleave', handleMouseLeavePage);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        gap: 2,
        p: isMobile ? 1 : 3,
        pt: isMobile ? '56px' : '80px',
        cursor: isDragging ? 'grabbing' : 'grab',
        alignItems: 'flex-start',
        height: '100vh',
        bgcolor: theme.palette.background.default,
        '&::-webkit-scrollbar': { display: 'none' },
        flexWrap: 'nowrap',
      }}
    >
      <Navbar />
      <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 1500,
          }}
        >
          {error}
        </Box>
      )}

      {!loading && tables.length > 0 && (
        tables.map((table) => (
          <TableColumn
            key={table.id}
            table={table}
            items={items}
            refreshTables={fetchTables}
            onItemClick={(item: ItemType) => setSelectedItem(item)}
          />
        ))
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setAddDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 30,
          right: isMobile ? 16 : 40,
          width: 64,
          height: 64,
          boxShadow: 4,
        }}
      >
        <AddIcon sx={{ fontSize: '2rem' }} />
      </Fab>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>New Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Table name"
            fullWidth
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTableSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTableSubmit}>Add</Button>
        </DialogActions>
      </Dialog>

      {selectedItem && (
        <ItemMenu
          itemId={selectedItem.id}
          itemName={selectedItem.itemName}
          itemDescrip={selectedItem.itemDescrip}
          onClose={() => setSelectedItem(null)}
          refreshItems={fetchTables}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {!isMobile && (
        <Box
          component="footer"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
            py: 2,
            bgcolor: 'rgba(18,18,18,0.8)',
            backdropFilter: 'blur(10px)',
            color: 'text.secondary',
            zIndex: 1000,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ by <strong>kotop21</strong> |{' '}
            <Link href="https://github.com/kotop21/todo-frontend" target="_blank" rel="noopener">
              Frontend
            </Link>{' '}
            |{' '}
            <Link href="https://github.com/kotop21/todo-backend" target="_blank" rel="noopener">
              Backend
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
