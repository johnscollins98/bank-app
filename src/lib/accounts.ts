export interface Account {
  email: string;
  apiToken: string;
  monthBarrier: 'last' | 'calendar';
  day: number;
}