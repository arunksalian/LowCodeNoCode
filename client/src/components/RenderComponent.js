import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { validateField } from '../utils/validation';

const useStyles = styled((theme) => ({
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  table: {
    minWidth: 300,
  },
  gridContainer: {
    width: '100%',
    margin: 0,
  },
}));

function RenderComponent({ type, properties, formContext, onValidationChange, onChange }) {
  const [value, setValue] = useState(properties.value || '');
  const [errors, setErrors] = useState([]);

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (properties.validation) {
      const validationErrors = validateField(newValue, properties.validation, formContext);
      setErrors(validationErrors);
      if (onValidationChange) {
        onValidationChange(validationErrors.length === 0);
      }
    }
  };

  useEffect(() => {
    // Validate initial value
    if (properties.validation && properties.value) {
      const validationErrors = validateField(properties.value, properties.validation, formContext);
      setErrors(validationErrors);
      if (onValidationChange) {
        onValidationChange(validationErrors.length === 0);
      }
    }
  }, [properties.validation, properties.value, formContext]);

  const getSizeStyles = () => ({
    width: properties.width || 'auto',
    height: properties.height || 'auto',
    minWidth: properties.minWidth,
    maxWidth: properties.maxWidth,
    minHeight: properties.minHeight,
    maxHeight: properties.maxHeight,
  });

  const classes = useStyles();

  switch (type) {
    case 'input':
      return (
        <TextField
          label={properties.label}
          placeholder={properties.placeholder}
          required={properties.required}
          type={properties.type}
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          error={errors.length > 0}
          helperText={errors.length > 0 ? errors[0] : ''}
          FormHelperTextProps={{
            error: errors.length > 0
          }}
          style={getSizeStyles()}
        />
      );

    case 'select':
      return (
        <FormControl variant="outlined" className={classes.formControl} error={errors.length > 0} style={getSizeStyles()}>
          <InputLabel>{properties.label}</InputLabel>
          <Select
            label={properties.label}
            required={properties.required}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          >
            {properties.options.split(',').map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={properties.checked}
              color="primary"
            />
          }
          label={properties.label}
          style={getSizeStyles()}
        />
      );

    case 'radio':
      return (
        <FormControl component="fieldset" style={getSizeStyles()}>
          <Typography>{properties.label}</Typography>
          <RadioGroup value={properties.defaultValue}>
            {properties.options.split(',').map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );

    case 'textarea':
      return (
        <TextField
          label={properties.label}
          placeholder={properties.placeholder}
          multiline
          rows={properties.rows}
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          error={errors.length > 0}
          helperText={errors.length > 0 ? errors[0] : ''}
          FormHelperTextProps={{
            error: errors.length > 0
          }}
          style={getSizeStyles()}
        />
      );

    case 'datepicker':
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={properties.label}
            value={value}
            onChange={(newValue) => handleChange(newValue)}
            format="MM/dd/yyyy"
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                required: properties.required,
                error: errors.length > 0,
                helperText: errors.length > 0 ? errors[0] : '',
                style: getSizeStyles()
              }
            }}
          />
        </LocalizationProvider>
      );

    case 'container':
      return (
        <Paper
          style={{
            padding: properties.padding,
            backgroundColor: properties.backgroundColor,
            borderRadius: properties.borderRadius,
            ...getSizeStyles()
          }}
        >
          Container
        </Paper>
      );

    case 'grid':
      return (
        <Grid container spacing={properties.spacing} className={classes.gridContainer} style={getSizeStyles()}>
          {Array.from({ length: properties.columns }).map((_, index) => (
            <Grid item xs={12 / properties.columns} key={index}>
              <Paper style={{ padding: '16px', textAlign: 'center' }}>
                Grid Item {index + 1}
              </Paper>
            </Grid>
          ))}
        </Grid>
      );

    case 'card':
      return (
        <Card elevation={properties.elevation} style={getSizeStyles()}>
          <CardHeader
            title={properties.title}
            subheader={properties.subtitle}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Card Content
            </Typography>
          </CardContent>
        </Card>
      );

    case 'text':
      return (
        <Typography variant={properties.variant} color={properties.color} style={getSizeStyles()}>
          {properties.content}
        </Typography>
      );

    case 'button':
      return (
        <Button
          variant={properties.variant}
          color={properties.color}
          size={properties.size}
          style={getSizeStyles()}
        >
          {properties.text}
        </Button>
      );

    case 'divider':
      return (
        <Divider
          orientation={properties.orientation}
          style={{ margin: properties.margin, ...getSizeStyles() }}
        />
      );

    case 'icon':
      return (
        <Icon
          color={properties.color}
          style={{ 
            fontSize: properties.size === 'large' ? 36 : 24,
            ...getSizeStyles()
          }}
        >
          {properties.name}
        </Icon>
      );

    case 'image':
      return (
        <img
          src={properties.src}
          alt={properties.alt}
          style={getSizeStyles()}
        />
      );

    case 'table':
      return (
        <TableContainer component={Paper} style={getSizeStyles()}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {properties.headers.split(',').map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {properties.headers.split(',').map((_, index) => (
                  <TableCell key={index}>Sample Data</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );

    default:
      return null;
  }
}

export default RenderComponent;
