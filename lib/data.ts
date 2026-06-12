import { User } from './types';

export const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Product', 'Design', 'Operations'];
export const roles = ['Junior Engineer', 'Senior Engineer', 'Lead Engineer', 'Manager', 'Director', 'Intern', 'Consultant'];
export const statuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];
export const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kevin', 'Lisa', 'Mike', 'Nancy', 'Oliver', 'Patricia', 'Quentin', 'Rachel', 'Steve', 'Tina'];
export const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'White', 'Harris'];

export const generateRandomData = (count: number): User[] => {
    const data: User[] = [];
    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const joinYear = 2018 + Math.floor(Math.random() * 6);
        const joinMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');

        data.push({
            id: i,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
            role: roles[Math.floor(Math.random() * roles.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            department: departments[Math.floor(Math.random() * departments.length)],
            salary: 50000 + Math.floor(Math.random() * 150000),
            joinDate: `${joinYear}-${joinMonth}-01`,
        });
    }
    return data;
};
