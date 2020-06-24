import { SubscriptionValidation } from '../validation';

export class SubscriptionConfirmationRequest {

    @SubscriptionValidation.confirmationToken()
    token!: string;
}
