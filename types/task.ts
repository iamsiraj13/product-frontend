export interface TaskProduct {
  id: string;
  title: string;
  image: string;
  price: string | number;
  commissionRate?: string | number;
  commission?: string | number;
  isHomeProduct?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserTaskItem {
  id: string;
  userId: string;
  productId: string;
  stepNumber: number;
  priceSnapshot: string | number;
  commissionSnapshot: string | number;
  earnedCommission?: string | number | null;
  rating?: number | null;
  comment?: string | null;
  status: 'GENERATED' | 'COMPLETED' | string;
  generatedAt?: string;
  completedAt?: string | null;
  product?: TaskProduct;
}

export interface PreGenerateTasksData {
  message: string;
  totalTasks: number;
  tasks: UserTaskItem[];
}

export interface UserTasksData {
  user: {
    id: string;
    username: string;
    taskLimit: number;
  };
  taskCount: number;
  taskLimit: number;
  tasks: UserTaskItem[];
}

export interface PreGenerateTasksPayload {
  count: number;
}

export interface OverrideTaskPayload {
  price: number;
  commissionRate: number;
  productId: string;
}

export interface SubmitTaskPayload {
  rating: number;
  comment: string;
}


