import { VIEW_MODE } from './constants';
import { ValueOf } from './utils';

export interface ExternalLink {
  image: string;
  link: string;
  name: string;
}

export interface Activation {
  name: string;
  description: string;
  triggeringImage: string;
  triggeringImageThumb: string;
  triggeringImageGhost: string;
  triggeringImageAr: string;
  videoResource: string;
  externalLinks: ExternalLink[];
  qrCodeUrl: string;
  collection: string;
  _id: string;
  totalViews: number;
  totalScans: number;
  totalLikes: number;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  partner: string;
  createdAt: string;
  password: string;
}

export interface CreateUser {
  email: string;
  password: string;
  name: string;
  role?: string;
  partner?: string;
}

export interface PartnerData {
  name: string;
  description: string;
  logoImage: string;
}

export interface CreatePartner extends PartnerData {
  firstUser: CreateUser;
}

export interface Partner {
  _id: string;
  name: string;
  description: string;
  logoImage: string;
  users: User[];
  createdAt: string;
}

export interface Collection {
  thumb: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  externalLinks: ExternalLink[];
  _id: string;
  publisherIcon: string;
  publisherName: string;
  activations: Activation[];
  partner: Partner;
  totalLikes: number;
  totalViews: number;
  catalogLabel?: string;
}

export type ViewMode = ValueOf<typeof VIEW_MODE>;
