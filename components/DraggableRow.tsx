import React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User } from '@/lib/types';

interface DraggableRowProps {
    row: Row<User>;
    depth?: number;
}

export default function DraggableRow({ row, depth = 0 }: DraggableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Check if this is a group row (has sub-rows)
    const isGrouped = row.getIsGrouped();
    const hasSubRows = row.subRows && row.subRows.length > 0;

    if (isGrouped && hasSubRows) {
        // This is a group header row - show expand/collapse button
        const groupValue = row.getValue(row.groupingColumnId || '');
        const visibleCells = row.getVisibleCells();

        return (
            <tr ref={setNodeRef} style={style} className="bg-blue-50 hover:bg-blue-100 border-b border-gray-200">
                <td colSpan={visibleCells.length} className="px-4 py-3">
                    <div
                        className="flex items-center gap-2"
                        style={{ marginLeft: `${depth * 20}px` }}
                    >
                        <button
                            onClick={() => row.toggleExpanded()}
                            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-blue-600"
                        >
                            <span className="text-lg">
                                {row.getIsExpanded() ? '▼' : '▶'}
                            </span>
                            <span>{String(groupValue)}</span>
                            <span className="text-sm text-gray-500 font-normal">
                                ({row.subRows.length} {row.subRows.length === 1 ? 'item' : 'items'})
                            </span>
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    // Normal data row
    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="border-b border-gray-100 hover:bg-gray-50"
            {...attributes}
            {...listeners}
        >
            {row.getVisibleCells().map((cell, cellIndex) => {
                // Check if this cell is part of grouping
                const isFirstCell = cellIndex === 0;
                const isPlaceholder = cell.getIsPlaceholder();

                if (isPlaceholder) {
                    return (
                        <td key={cell.id} className="px-4 py-3 text-gray-700">
                            {/* Empty placeholder for grouped columns */}
                        </td>
                    );
                }

                return (
                    <td key={cell.id} className="px-4 py-3 text-gray-700">
                        {isFirstCell && depth > 0 && !isGrouped && (
                            <div style={{ marginLeft: `${depth * 20}px` }}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                        )}
                        {(!isFirstCell || depth === 0 || isGrouped) && (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                    </td>
                );
            })}
        </tr>
    );
}
