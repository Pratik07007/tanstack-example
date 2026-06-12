import React from 'react';
import { Column } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User } from '@/lib/types';

interface DraggableColumnItemProps {
    column: Column<User, unknown>;
    isVisible: boolean;
    onToggle: (event: unknown) => void;
}

export default function DraggableColumnItem({ column, isVisible, onToggle }: DraggableColumnItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-move hover:bg-gray-50"
            {...attributes}
            {...listeners}
        >
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={onToggle}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="flex-1 text-gray-700 text-sm font-medium">
                    {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                </span>
                <span className="text-gray-400 text-sm cursor-grab">⋮⋮</span>
            </label>
        </div>
    );
}
