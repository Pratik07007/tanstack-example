import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { User } from './types';

const columnHelper = createColumnHelper<User>();

export const getColumns = () => [
    columnHelper.accessor('id', {
        id: 'id',
        header: 'ID',
        enableGrouping: false,
        enableSorting: true,
        enableHiding: true,
    }),
    columnHelper.accessor('name', {
        id: 'name',
        header: 'Full Name',
        enableGrouping: true,
        enableSorting: true,
        enableHiding: true,
    }),
    columnHelper.accessor('email', {
        id: 'email',
        header: 'Email',
        enableGrouping: false,
        enableSorting: true,
        enableHiding: true,
    }),
    columnHelper.accessor('role', {
        id: 'role',
        header: 'Role',
        enableGrouping: true,
        enableSorting: true,
        enableHiding: true,
    }),
    columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        enableGrouping: true,
        enableSorting: true,
        enableHiding: true,
        cell: (info) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor('department', {
        id: 'department',
        header: 'Department',
        enableGrouping: true,
        enableSorting: true,
        enableHiding: true,
    }),
    columnHelper.accessor('salary', {
        id: 'salary',
        header: 'Salary',
        enableGrouping: true,
        enableSorting: true,
        enableHiding: true,
        cell: (info) => `NPR${info.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor('joinDate', {
        id: 'joinDate',
        header: 'Join Date',
        enableGrouping: true,
        enableSorting: true,
        enableHiding: true,
    }),
];
