import { ComponentType } from 'react';

import { Stack, Tooltip, Typography } from '@mui/material';

export const AnalyticStat = ({ value, label, Icon }: { value: number; label: string; Icon: ComponentType }) => {
  return (
    <Tooltip title={`${label}: ${value}`} arrow>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Icon />
        <Typography variant="body1">{value}</Typography>
      </Stack>
    </Tooltip>
  );
};
