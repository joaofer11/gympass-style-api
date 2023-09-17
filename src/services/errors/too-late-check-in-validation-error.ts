export class TooLateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can only be validated by 20 minutes of its creation.');
  }
}
