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
import { deleteTable } from '../api/tables/delete-tables';

interface TableMenuProps {
  tableId: number;
  tableName?: string;
  refreshTables?: () => void;
}

const ITEM_HEIGHT = 48;

export default function TableMenu({ tableId, tableName, refreshTables }: TableMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    handleClose();
    if (!confirm(`Вы уверены, что хотите удалить таблицу "${tableName || tableId}"?`)) return;

    try {
      setLoading(true);
      await deleteTable(tableId);
      alert('Таблица успешно удалена!');
      if (refreshTables) refreshTables();
    } catch (err: any) {
      console.error(err);
      alert('Ошибка при удалении таблицы');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    handleClose();
    alert(`Редактирование таблицы: ${tableName || tableId}`);
  };

  const handleAdd = () => {
    handleClose();
    alert(`Добавление элемента в таблицу: ${tableName || tableId}`);
  };

  const menuOptions: { label: string; icon: JSX.Element; action: () => void }[] = [
    { label: 'Edit Table', icon: <EditIcon fontSize="small" />, action: handleEdit },
    { label: 'Delete Table', icon: <DeleteIcon fontSize="small" />, action: handleDelete },
    { label: 'Add Item', icon: <AddIcon fontSize="small" />, action: handleAdd },
  ];

  return (
    <>
      <IconButton
        aria-label="more"
        id={`menu-button-${tableId}`}
        aria-controls={open ? `menu-${tableId}` : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ color: '#ffffff' }}
        disabled={loading}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={`menu-${tableId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
    </>
  );
}
