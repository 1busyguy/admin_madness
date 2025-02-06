import React from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';

import { Activation } from '../../../shared/types';

interface ActivationsMultiSelectProps {
  activations: Activation[];
  selectedActivations: Activation[];
  onChange: (newSelected: Activation[]) => void;
}

export const ActivationsMultiSelect = ({ activations, selectedActivations, onChange }: ActivationsMultiSelectProps) => {
  const availableActivations = (activations || []).filter(
    (activation) => !(selectedActivations || []).some((selected: Activation) => selected?._id === activation._id),
  );

  return (
    <Autocomplete
      multiple
      options={availableActivations}
      getOptionLabel={(option) => option.name}
      value={selectedActivations}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Select Activations" placeholder="Choose activations" />
      )}
      renderOption={(props, option) => (
        <ListItem {...props} key={option._id}>
          <ListItemAvatar>
            <Avatar src={option.triggeringImageThumb} alt={option.name} sx={{ width: 40, height: 40 }} />
          </ListItemAvatar>
          <ListItemText primary={option.name} />
        </ListItem>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.name}
            avatar={<Avatar src={option.triggeringImageThumb} alt={option.name} />}
            {...getTagProps({ index })}
            key={option._id}
            deleteIcon={<CancelIcon />}
            onDelete={() => {
              const updatedActivations = value.filter((_, i) => i !== index);
              onChange(updatedActivations);
            }}
          />
        ))
      }
      noOptionsText="No more activations to select"
      isOptionEqualToValue={(option, value) => option._id === value._id}
      disableCloseOnSelect
    />
  );
};
