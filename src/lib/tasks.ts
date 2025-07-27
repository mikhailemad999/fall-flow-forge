// Task Management System with Local Storage
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}

class TaskService {
  private readonly TASKS_KEY = 'task_manager_tasks';
  private readonly CATEGORIES_KEY = 'task_manager_categories';

  private getTasks(): Task[] {
    const tasks = localStorage.getItem(this.TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  getTasksByUser(userId: string): Task[] {
    return this.getTasks().filter(task => task.userId === userId);
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, userId: string): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId
    };
    
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    this.saveTasks(filteredTasks);
    return true;
  }

  getTaskStats(userId: string): TaskStats {
    const userTasks = this.getTasksByUser(userId);
    const total = userTasks.length;
    const completed = userTasks.filter(task => task.status === 'completed').length;
    const inProgress = userTasks.filter(task => task.status === 'in_progress').length;
    
    const overdue = userTasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate
    };
  }

  getCategories(): string[] {
    const categories = localStorage.getItem(this.CATEGORIES_KEY);
    const defaultCategories = ['Work', 'Personal', 'Study', 'Health', 'Finance'];
    
    if (!categories) {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    
    return JSON.parse(categories);
  }

  addCategory(category: string): void {
    const categories = this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    }
  }

  // Initialize with sample data for demo
  initializeSampleData(userId: string): void {
    const existingTasks = this.getTasksByUser(userId);
    if (existingTasks.length > 0) return;

    const sampleTasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish the Q1 project proposal and submit to management',
        status: 'in_progress' as const,
        priority: 'high' as const,
        category: 'Work',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Review team performance',
        description: 'Conduct quarterly review meetings with team members',
        status: 'todo' as const,
        priority: 'medium' as const,
        category: 'Work',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Update portfolio website',
        description: 'Add recent projects and update design',
        status: 'completed' as const,
        priority: 'low' as const,
        category: 'Personal'
      }
    ];

    sampleTasks.forEach(taskData => {
      this.createTask(taskData, userId);
    });
  }
}

export const taskService = new TaskService();