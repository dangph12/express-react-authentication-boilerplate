import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { DataTableColumnHeader } from '~/components/admin/data-table-column-header';
import { DataTablePagination } from '~/components/admin/data-table-pagination';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';
import DeleteBulkUsersDialog from '~/features/users/delete-user/components/delete-bulk-users-dialog';
import DeleteUserDialog from '~/features/users/delete-user/components/delete-user-dialog';
import { useUsers } from '~/features/users/view-users/api/view-users';

const UsersTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') || '-createdAt';
  const name = searchParams.get('name') || undefined;
  const gender = searchParams.getAll('gender').length
    ? searchParams.getAll('gender')
    : undefined;
  const role = searchParams.getAll('role').length
    ? searchParams.getAll('role')
    : undefined;

  const { data, isLoading } = useUsers({
    page,
    limit,
    sort,
    name,
    gender,
    role
  });

  const parseSorting = sortString => {
    if (!sortString) return [];
    return sortString.split(',').map(s => {
      const desc = s.startsWith('-');
      const id = desc ? s.slice(1) : s;
      return { id, desc };
    });
  };

  const sorting = parseSorting(sort);

  const handleSortingChange = updater => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater;

    const newParams = new URLSearchParams(searchParams);
    if (newSorting.length) {
      const sortString = newSorting
        .map(s => (s.desc ? `-${s.id}` : s.id))
        .join(',');
      newParams.set('sort', sortString);
    } else {
      newParams.set('sort', '-createdAt');
    }

    setSearchParams(newParams);
  };

  const handleDelete = user => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false
    },
    {
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => (
        <Avatar className='h-10 w-10'>
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>
            <img
              src='/default-avatar.jpg'
              alt='Default avatar'
              className='h-full w-full object-cover'
            />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      )
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      )
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Gender' />
      ),
      cell: ({ row }) => (
        <span className='capitalize'>{row.original.gender}</span>
      )
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Role' />
      ),
      cell: ({ row }) => <span className='capitalize'>{row.original.role}</span>
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => (
        <span>{row.original.isActive ? 'Active' : 'Inactive'}</span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate(`/admin/manage-users/${row.original._id}`)}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      ),
      enableSorting: false
    }
  ];

  const handlePaginationChange = updater => {
    const currentPagination = {
      pageIndex: page - 1,
      pageSize: limit
    };

    const newPagination =
      typeof updater === 'function' ? updater(currentPagination) : updater;

    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', (newPagination.pageIndex + 1).toString());
    newParams.set('limit', newPagination.pageSize.toString());

    setSearchParams(newParams);
  };

  const table = useReactTable({
    data: data?.docs || [],
    columns,
    pageCount: data?.totalPages || 0,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit
      },
      sorting,
      rowSelection
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedUserIds = selectedRows.map(row => row.original._id);

  return (
    <>
      {selectedRows.length > 0 && (
        <div className='flex items-center justify-between rounded-md border bg-muted/50 p-4 mb-4'>
          <div className='text-sm text-muted-foreground'>
            {selectedRows.length} {selectedRows.length === 1 ? 'user' : 'users'}{' '}
            selected
          </div>
          <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Selected
          </Button>
        </div>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} loading={isLoading} />

      <DeleteUserDialog
        user={userToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <DeleteBulkUsersDialog
        userIds={selectedUserIds}
        open={bulkDeleteDialogOpen}
        onOpenChange={open => {
          setBulkDeleteDialogOpen(open);
          if (!open) {
            setRowSelection({});
          }
        }}
      />
    </>
  );
};

export default UsersTable;
