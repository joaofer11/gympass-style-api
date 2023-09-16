export class ReachedMaxCheckInPerDay extends Error {
  constructor() {
    super('Reached max check-in per day.');
  }
}
