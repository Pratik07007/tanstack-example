export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
    department: string;
    salary: number;
    joinDate: string;
};
