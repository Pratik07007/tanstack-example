'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    getCoreRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    useReactTable,
    SortingState,
    VisibilityState,
    GroupingState,
    ColumnOrderState,
    ExpandedState,
} from '@tanstack/react-table';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { generateRandomData } from '@/lib/data';
import { getColumns } from '@/lib/columns';
import DraggableRow from './DraggableRow';
import DraggableColumnItem from './DraggableColumnItem';
import SortableHeader from './SortableHeader';

export default function AdvancedTable() {
    const [isMounted, setIsMounted] = useState(false);
    const [data] = useState(() => generateRandomData(1000));
    const [sorting, setSorting] = useState<SortingState>([]);
    const [grouping, setGrouping] = useState<GroupingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
        getColumns().map((col) => col.id as string)
    );
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const columns = useMemo(() => getColumns(), []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            grouping,
            columnVisibility,
            columnOrder,
            expanded,
        },
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        enableSorting: true,
        enableGrouping: true,
    });

    const handleColumnDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setColumnOrder((currentOrder) => {
                const oldIndex = currentOrder.indexOf(active.id as string);
                const newIndex = currentOrder.indexOf(over?.id as string);
                return arrayMove(currentOrder, oldIndex, newIndex);
            });
        }
    }, []);

    // Prevent hydration mismatches by rendering only on the client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Helper function to get grouping order display
    const getGroupingDisplay = () => {
        return grouping.map((groupId, index) => {
            const column = table.getAllLeafColumns().find(col => col.id === groupId);
            const name = typeof column?.columnDef.header === 'string' ? column.columnDef.header : groupId;
            return `${index + 1}. ${name}`;
        }).join(' → ');
    };

    if (!isMounted) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500 font-medium">Loading advanced table...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Advanced Data Table with Nested Grouping
                </h1>
                <div className="flex gap-4 mb-6 flex-wrap">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-sm text-gray-600">Total Records:</span>
                        <span className="ml-2 font-semibold text-gray-900">{data.length.toLocaleString()}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-sm text-gray-600">Grouping Hierarchy:</span>
                        <span className="ml-2 font-semibold text-blue-600">
                            {grouping.length > 0 ? getGroupingDisplay() : 'None'}
                        </span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-sm text-gray-600">Visible Columns:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                            {table.getAllLeafColumns().filter(col => col.getIsVisible()).length}/{getColumns().length}
                        </span>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* LEFT SIDE: Main Table */}
                    <div className="flex-1">
                        {/* Grouping Controls */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                            <h3 className="text-gray-900 font-semibold mb-3 text-sm">
                                📊 Group By Columns (Order Matters for Hierarchy)
                            </h3>
                            <div className="flex gap-2 flex-wrap mb-3">
                                {table.getAllLeafColumns().map((column) => {
                                    if (!column.getCanGroup()) return null;
                                    const isActive = grouping.includes(column.id);
                                    const groupIndex = grouping.indexOf(column.id);
                                    return (
                                        <button
                                            key={column.id}
                                            onClick={() => {
                                                if (isActive) {
                                                    // Remove this column from grouping
                                                    setGrouping(grouping.filter(g => g !== column.id));
                                                } else {
                                                    // Add this column to the end of grouping order
                                                    setGrouping([...grouping, column.id]);
                                                }
                                                // Auto-expand all groups when grouping changes
                                                setExpanded(true);
                                            }}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${isActive
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                                            {isActive && ` (${groupIndex + 1})`}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Show current grouping order */}
                            {grouping.length > 0 && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-800 font-medium">
                                        Current Hierarchy: {getGroupingDisplay()}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        💡 Data is nested in this order. Click a group to expand/collapse.
                                    </p>
                                </div>
                            )}

                            {grouping.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            setGrouping([]);
                                            setExpanded({});
                                        }}
                                        className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Clear All Groups
                                    </button>
                                    <button
                                        onClick={() => setExpanded(true)}
                                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Expand All Groups
                                    </button>
                                    <button
                                        onClick={() => setExpanded({})}
                                        className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    >
                                        Collapse All Groups
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleColumnDragEnd}
                                modifiers={[restrictToHorizontalAxis]}
                            >
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                                                    {headerGroup.headers.map((header) => (
                                                        <SortableHeader key={header.id} header={header} />
                                                    ))}
                                                </SortableContext>
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map((row) => {
                                            // Calculate depth for indentation
                                            const depth = row.depth || 0;
                                            return <DraggableRow key={row.id} row={row} depth={depth} />;
                                        })}
                                    </tbody>
                                </table>
                            </DndContext>
                        </div>

                        {grouping.length === 0 && (
                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    💡 Tip: Click multiple &quot;Group By&quot; buttons to create nested hierarchies!
                                    <br />
                                    Example: Click &quot;Department&quot; then &quot;Role&quot; to see departments with roles inside.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Column Management */}
                    <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-6">
                        <h3 className="text-gray-900 font-semibold mb-3 text-sm border-b border-gray-200 pb-2">
                            📋 Column Manager
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                            Drag to reorder • Check to show/hide
                        </p>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleColumnDragEnd}
                        >
                            <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {table.getAllLeafColumns().map((column) => (
                                        <DraggableColumnItem
                                            key={column.id}
                                            column={column}
                                            isVisible={column.getIsVisible()}
                                            onToggle={column.getToggleVisibilityHandler()}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                            <button
                                onClick={() => {
                                    const allVisible: VisibilityState = {};
                                    table.getAllLeafColumns().forEach(col => {
                                        allVisible[col.id] = true;
                                    });
                                    setColumnVisibility(allVisible);
                                }}
                                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                                Show All Columns
                            </button>
                            <button
                                onClick={() => {
                                    const noneVisible: VisibilityState = {};
                                    table.getAllLeafColumns().forEach(col => {
                                        noneVisible[col.id] = false;
                                    });
                                    setColumnVisibility(noneVisible);
                                }}
                                className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                            >
                                Hide All Columns
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
