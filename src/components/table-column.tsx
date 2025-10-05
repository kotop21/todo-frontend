import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import type { TableType } from '../api/tables/get-tables';
import type { ItemType } from '../api/items/get-items';
import TableMenu from './table-menu';

interface Props {
  table: TableType;
  items: ItemType[];
  refreshTables: () => void;
}

export default function TableColumn({ table, items, refreshTables }: Props) {
  return (
    <List
      sx={{
        width: 300,
        bgcolor: '#171717',
        flexShrink: 0,
        borderRadius: 2,
        overflow: 'hidden',
      }}
      component="nav"
      aria-labelledby={`table-${table.id}`}
      subheader={
        <ListSubheader
          sx={{
            bgcolor: '#171717',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          component="div"
          id={`table-${table.id}`}
        >
          {table.name}
          <TableMenu
            tableId={table.id}
            tableName={table.name}
            refreshTables={refreshTables}
          />
        </ListSubheader>
      }
    >
      {items
        .filter((item) => item.tableId === table.id)
        .map((item) => (
          <ListItemButton
            key={item.id}
            sx={{ bgcolor: '#1e1e1e', mb: 0.5, '&:hover': { bgcolor: '#292929' } }}
          >
            <ListItemText
              primary={item.itemName}
              secondary={item.itemDescrip}
              primaryTypographyProps={{ color: '#fff' }}
              secondaryTypographyProps={{ color: '#aaa' }}
            />
          </ListItemButton>
        ))}
    </List>
  );
}
