import { ExternalLink } from '../../shared/types';

export interface ActivationData {
  name: string;
  description: string;
  triggeringImage: string;
  triggeringImageThumb: string;
  triggeringImageGhost: string;
  triggeringImageAr: string;
  videoResource: string;
  externalLinks: ExternalLink[];
  collection: string | null;
}
