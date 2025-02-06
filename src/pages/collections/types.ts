import { ExternalLink } from '../../shared/types';

export interface CollectionData {
  thumb: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  externalLinks: ExternalLink[];
  activations: string[];
  catalogLabel?: string;
}
