import type { Employee } from '../types';
import employeesData from './employee.json';

const API_BASE = 'http://localhost:3001';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isMockServerRunning = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const response = await fetch(`${API_BASE}/api/employees`, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
};

export const api = {
  getEmployees: async (): Promise<Employee[]> => {
    const serverRunning = await isMockServerRunning();
    
    if (serverRunning) {
      await delay(300);
      const response = await fetch(`${API_BASE}/api/employees`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return response.json() as Promise<Employee[]>;
    } else {
      await delay(300);
      return employeesData as Employee[];
    }
  },
  
  getFilteredEmployees: async (filters: any): Promise<Employee[]> => {
    const employees = await api.getEmployees();
    
    await delay(200);
    return employees.filter((employee: Employee) => {
      if (filters.department && employee.department !== filters.department) return false;
      if (filters.isActive !== undefined && employee.isActive !== filters.isActive) return false;
      return true;
    });
  }
};

export const getEmployeesSync = (): Employee[] => {
  return employeesData as Employee[];
};

export default api;
