import { DataGrid } from '@mui/x-data-grid';

export default function ReactTable({
  rows = [],
  columns = [],
  isLoading = false,
}) {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}