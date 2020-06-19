import { Blackboard } from '../model/Blackboard';

export interface BlackboardRepository {

    create(blackboard: Blackboard): Promise<void>;
}
