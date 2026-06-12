import React from 'react';
import { Header, flexRender } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User } from '@/lib/types';

interface SortableHeaderProps {
    header: Header<User, unknown>;
}

export default function SortableHeader({ header }: SortableHeaderProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: header.column.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <th
            ref={setNodeRef}
            style={style}
            className="px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-200 cursor-grab"
            {...attributes}
            {...listeners}
        >
            {header.isPlaceholder ? null : (
                <div className="flex items-center gap-2">
                    <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="text-xs">
                            {{
                                asc: '↑',
                                desc: '↓',
                             }[header.column.getIsSorted() as string] ?? '↕️'}
                        </span>
                    </div>
                    <span className="text-gray-400 text-sm cursor-grab">⋮⋮</span>
                </div>
            )}
        </th>
    );
}
