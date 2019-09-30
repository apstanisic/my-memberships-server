import { WithId, UUID } from '../types';
import { User } from '../../user/user.entity';

/**
 * Info that should be passed to LogService.
 * It contains info that is important for logging.
 */
export interface LogMetadata {
  user: User;
  reason?: string;
  domain?: WithId | UUID;
}
