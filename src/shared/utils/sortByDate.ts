import { setMonth } from 'date-fns';

export default class Sort {
  ByDate(date: number) {
    const now = date ? new Date(setMonth(new Date(), date)) : new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 2);

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return {
      firstDay,
      lastDay,
    };
  }
}
