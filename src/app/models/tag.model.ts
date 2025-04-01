export interface Tag {
    _id?: string;
    name: string;
    description?: string;
    category?: string;
    createdAt?: Date;
    isActive: boolean;
  }