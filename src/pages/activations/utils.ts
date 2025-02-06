import { HTTP, HTTPS } from '../../constants/constants';
import { isNilOrEmpty } from '../../shared/utils';

export const buildVideoUrl = (videoResource: string): string => {
  if (isNilOrEmpty(videoResource)) {
    return videoResource;
  }

  if (videoResource.startsWith(HTTP) || videoResource.startsWith(HTTPS)) {
    return videoResource;
  }

  return `${HTTPS}${videoResource}`;
};
