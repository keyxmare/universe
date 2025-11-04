export interface AppMeta {
  id: string;
  name: string;
  route: string;
  description?: string;
}

export const applications: AppMeta[] = [
  {
    id: 'projets',
    name: 'Projets',
    route: '/projets',
    description: 'Gérer et explorer les projets.'
  }
];
