import { sleep } from '../utils/Utils';

export default class DataService {
  static async GetOverview(): Promise<string[]> {
    await sleep(2000);
    return ['this is', 'some', 'good', 'data'];
  }
}
