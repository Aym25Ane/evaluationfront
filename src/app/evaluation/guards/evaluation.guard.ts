import { CanActivateFn } from '@angular/router';

export const evaluationGuard: CanActivateFn = () => {
  // TODO: Replace with JWT-based authorization check.
  return true;
};
