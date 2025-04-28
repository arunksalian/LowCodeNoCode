import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  overflowY: 'auto',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledValidationSection = styled('div')(({ theme }) => ({
  width: '100%',
}));

const StyledConditionsSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledHelpText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontStyle: 'italic',
}));

const StyledOrGroup = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledOrLabel = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const StyledGroupHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const StyledConditionGroup = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const StyledConditionRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const StyledConditionField = styled(FormControl)(({ theme }) => ({
  flex: 1,
  minWidth: 120,
}));

const StyledDeleteButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledAddGroupButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function PropertyEditor({ component, onUpdate, availableComponents = [] }) {
  if (!component) {
    return (
      <StyledPaper>
        <Typography variant="body1">
          Select a component to edit its properties
        </Typography>
      </StyledPaper>
    );
  }

  const handleChange = (property, value) => {
    if (property.includes('.')) {
      const [parent, child] = property.split('.');
      onUpdate({
        ...component.properties,
        [parent]: {
          ...component.properties[parent],
          [child]: value
        }
      });
    } else {
      onUpdate({
        ...component.properties,
        [property]: value,
      });
    }
  };

  const handleAddGroup = () => {
    const newGroup = `Group ${(component.properties.validation.conditionGroups || []).length + 1}`;
    handleChange('validation.conditionGroups', [
      ...(component.properties.validation.conditionGroups || []),
      newGroup
    ]);
  };

  const handleRemoveGroup = (groupName) => {
    // Remove group from conditionGroups
    const groups = [...(component.properties.validation.conditionGroups || [])];
    const updatedGroups = groups.filter(g => g !== groupName);
    handleChange('validation.conditionGroups', updatedGroups);

    // Remove conditions with this group
    const conditions = [...(component.properties.validation.conditions || [])];
    const updatedConditions = conditions.filter(c => c.group !== groupName);
    handleChange('validation.conditions', updatedConditions);
  };

  const handleAddCondition = (group = null) => {
    const newCondition = {
      targetId: '',
      operator: 'equals',
      value: '',
      group
    };

    handleChange('validation.conditions', [
      ...(component.properties.validation.conditions || []),
      newCondition
    ]);
  };

  const handleUpdateCondition = (index, field, value) => {
    const conditions = [...(component.properties.validation.conditions || [])];
    conditions[index] = {
      ...conditions[index],
      [field]: value
    };
    handleChange('validation.conditions', conditions);
  };

  const handleRemoveCondition = (index) => {
    const conditions = [...(component.properties.validation.conditions || [])];
    conditions.splice(index, 1);
    handleChange('validation.conditions', conditions);
  };

  const renderConditionGroup = (groupName = null) => {
    const conditions = component.properties.validation?.conditions || [];
    const groupConditions = conditions.filter(c => c.group === groupName);

    return (
      <StyledConditionGroup>
        {groupName && (
          <StyledGroupHeader>
            <Typography variant="subtitle2">{groupName}</Typography>
            <StyledDeleteButton
              size="small"
              onClick={() => handleRemoveGroup(groupName)}
            >
              <DeleteIcon />
            </StyledDeleteButton>
          </StyledGroupHeader>
        )}
        {groupConditions.map((condition, index) => (
          <StyledConditionRow key={`${groupName}-${index}`}>
            <StyledConditionField>
              <InputLabel>Target Component</InputLabel>
              <Select
                value={condition.targetId}
                onChange={(e) => handleUpdateCondition(conditions.indexOf(condition), 'targetId', e.target.value)}
              >
                {availableComponents.map(comp => (
                  <MenuItem key={comp.id} value={comp.id}>
                    {comp.type} - {comp.properties.label || comp.id}
                  </MenuItem>
                ))}
              </Select>
            </StyledConditionField>
            <StyledConditionField>
              <InputLabel>Operator</InputLabel>
              <Select
                value={condition.operator}
                onChange={(e) => handleUpdateCondition(conditions.indexOf(condition), 'operator', e.target.value)}
              >
                <MenuItem value="equals">Equals</MenuItem>
                <MenuItem value="notEquals">Not Equals</MenuItem>
                <MenuItem value="contains">Contains</MenuItem>
                <MenuItem value="notContains">Not Contains</MenuItem>
                <MenuItem value="greaterThan">Greater Than</MenuItem>
                <MenuItem value="lessThan">Less Than</MenuItem>
                <MenuItem value="isEmpty">Is Empty</MenuItem>
                <MenuItem value="isNotEmpty">Is Not Empty</MenuItem>
                <MenuItem value="isChecked">Is Checked</MenuItem>
                <MenuItem value="isNotChecked">Is Not Checked</MenuItem>
              </Select>
            </StyledConditionField>
            {!['isEmpty', 'isNotEmpty', 'isChecked', 'isNotChecked'].includes(condition.operator) && (
              <TextField
                className={StyledConditionField}
                label="Value"
                value={condition.value}
                onChange={(e) => handleUpdateCondition(conditions.indexOf(condition), 'value', e.target.value)}
              />
            )}
            <StyledDeleteButton
              size="small"
              onClick={() => handleRemoveCondition(conditions.indexOf(condition))}
            >
              <DeleteIcon />
            </StyledDeleteButton>
          </StyledConditionRow>
        ))}
        <StyledAddButton
          startIcon={<AddIcon />}
          onClick={() => handleAddCondition(groupName)}
          variant="outlined"
          size="small"
        >
          Add Condition
        </StyledAddButton>
      </StyledConditionGroup>
    );
  };

  const renderConditions = () => {
    const conditions = component.properties.validation?.conditions || [];

    return (
      <StyledConditionsSection>
        <Typography variant="subtitle2" gutterBottom>
          Conditional Validation Rules
        </Typography>
        <StyledHelpText variant="body2" color="textSecondary">
          Conditions within the same group use AND logic. Different groups use OR logic.
        </StyledHelpText>

        {/* Default group (AND conditions) */}
        {renderConditionGroup(null)}

        {/* OR condition groups */}
        {(component.properties.validation.conditionGroups || []).map((groupName) => (
          <StyledOrGroup key={groupName}>
            <StyledOrLabel variant="body1">OR</StyledOrLabel>
            {renderConditionGroup(groupName)}
          </StyledOrGroup>
        ))}

        <StyledAddGroupButton
          startIcon={<AddIcon />}
          onClick={handleAddGroup}
          variant="outlined"
          size="small"
        >
          Add OR Group
        </StyledAddGroupButton>
      </StyledConditionsSection>
    );
  };

  const renderSizeProperties = () => {
    return (
      <StyledAccordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Size Properties</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyledFormControl>
            <TextField
              label="Width"
              value={component.properties.width || ''}
              onChange={(e) => handleChange('width', e.target.value)}
              placeholder="e.g., 100px, 50%, auto"
            />
          </StyledFormControl>
          <StyledFormControl>
            <TextField
              label="Height"
              value={component.properties.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="e.g., 100px, 50%, auto"
            />
          </StyledFormControl>
          <StyledFormControl>
            <TextField
              label="Min Width"
              value={component.properties.minWidth || ''}
              onChange={(e) => handleChange('minWidth', e.target.value)}
              placeholder="e.g., 100px, 50%"
            />
          </StyledFormControl>
          <StyledFormControl>
            <TextField
              label="Max Width"
              value={component.properties.maxWidth || ''}
              onChange={(e) => handleChange('maxWidth', e.target.value)}
              placeholder="e.g., 100px, 50%"
            />
          </StyledFormControl>
          <StyledFormControl>
            <TextField
              label="Min Height"
              value={component.properties.minHeight || ''}
              onChange={(e) => handleChange('minHeight', e.target.value)}
              placeholder="e.g., 100px, 50%"
            />
          </StyledFormControl>
          <StyledFormControl>
            <TextField
              label="Max Height"
              value={component.properties.maxHeight || ''}
              onChange={(e) => handleChange('maxHeight', e.target.value)}
              placeholder="e.g., 100px, 50%"
            />
          </StyledFormControl>
        </AccordionDetails>
      </StyledAccordion>
    );
  };

  const renderValidationFields = () => {
    if (!component.properties.validation) return null;

    return (
      <StyledAccordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Validation Rules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyledValidationSection>
            <FormControlLabel
              control={
                <Switch
                  checked={component.properties.validation.required || false}
                  onChange={(e) => handleChange('validation.required', e.target.checked)}
                />
              }
              label="Required"
            />
            {renderConditions()}
            {(component.type === 'input' || component.type === 'textarea') && (
              <>
                <TextField
                  className={StyledFormControl}
                  label="Minimum Length"
                  type="number"
                  value={component.properties.validation.minLength || 0}
                  onChange={(e) => handleChange('validation.minLength', parseInt(e.target.value))}
                />
                <TextField
                  className={StyledFormControl}
                  label="Maximum Length"
                  type="number"
                  value={component.properties.validation.maxLength || 100}
                  onChange={(e) => handleChange('validation.maxLength', parseInt(e.target.value))}
                />
                <TextField
                  className={StyledFormControl}
                  label="Pattern (RegEx)"
                  value={component.properties.validation.pattern || ''}
                  onChange={(e) => handleChange('validation.pattern', e.target.value)}
                />
                <TextField
                  className={StyledFormControl}
                  label="Pattern Error Message"
                  value={component.properties.validation.patternError || ''}
                  onChange={(e) => handleChange('validation.patternError', e.target.value)}
                />
                <TextField
                  className={StyledFormControl}
                  label="Custom Validation Function"
                  multiline
                  rows={4}
                  value={component.properties.validation.custom || ''}
                  onChange={(e) => handleChange('validation.custom', e.target.value)}
                  helperText="Enter a JavaScript function that returns an error message or null"
                />
              </>
            )}
          </StyledValidationSection>
        </AccordionDetails>
      </StyledAccordion>
    );
  };

  const renderPropertyFields = () => {
    switch (component.type) {
      case 'input':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Label"
              value={component.properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Placeholder"
              value={component.properties.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
            />
            <FormControl className={StyledFormControl}>
              <InputLabel>Type</InputLabel>
              <Select
                value={component.properties.type || 'text'}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="password">Password</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="number">Number</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={component.properties.required || false}
                  onChange={(e) => handleChange('required', e.target.checked)}
                />
              }
              label="Required"
            />
            {renderSizeProperties()}
          </>
        );

      case 'select':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Label"
              value={component.properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Options (comma-separated)"
              value={component.properties.options || ''}
              onChange={(e) => handleChange('options', e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={component.properties.required || false}
                  onChange={(e) => handleChange('required', e.target.checked)}
                />
              }
              label="Required"
            />
          </>
        );

      case 'checkbox':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Label"
              value={component.properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={component.properties.checked || false}
                  onChange={(e) => handleChange('checked', e.target.checked)}
                />
              }
              label="Checked"
            />
          </>
        );

      case 'radio':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Group Label"
              value={component.properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Options (comma-separated)"
              value={component.properties.options || ''}
              onChange={(e) => handleChange('options', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Default Value"
              value={component.properties.defaultValue || ''}
              onChange={(e) => handleChange('defaultValue', e.target.value)}
            />
          </>
        );

      case 'textarea':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Label"
              value={component.properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Placeholder"
              value={component.properties.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Rows"
              type="number"
              value={component.properties.rows || 4}
              onChange={(e) => handleChange('rows', parseInt(e.target.value))}
            />
          </>
        );

      case 'datepicker':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Label"
              value={component.properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={component.properties.required || false}
                  onChange={(e) => handleChange('required', e.target.checked)}
                />
              }
              label="Required"
            />
          </>
        );

      case 'container':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Padding"
              value={component.properties.padding || ''}
              onChange={(e) => handleChange('padding', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Background Color"
              value={component.properties.backgroundColor || ''}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Border Radius"
              value={component.properties.borderRadius || ''}
              onChange={(e) => handleChange('borderRadius', e.target.value)}
            />
          </>
        );

      case 'grid':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Columns"
              type="number"
              value={component.properties.columns || 2}
              onChange={(e) => handleChange('columns', parseInt(e.target.value))}
            />
            <TextField
              className={StyledFormControl}
              label="Spacing"
              type="number"
              value={component.properties.spacing || 2}
              onChange={(e) => handleChange('spacing', parseInt(e.target.value))}
            />
          </>
        );

      case 'card':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Title"
              value={component.properties.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Subtitle"
              value={component.properties.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Elevation"
              type="number"
              value={component.properties.elevation || 1}
              onChange={(e) => handleChange('elevation', parseInt(e.target.value))}
            />
          </>
        );

      case 'text':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Content"
              multiline
              rows={4}
              value={component.properties.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
            />
            <FormControl className={StyledFormControl}>
              <InputLabel>Variant</InputLabel>
              <Select
                value={component.properties.variant || 'body1'}
                onChange={(e) => handleChange('variant', e.target.value)}
              >
                <MenuItem value="h1">Heading 1</MenuItem>
                <MenuItem value="h2">Heading 2</MenuItem>
                <MenuItem value="h3">Heading 3</MenuItem>
                <MenuItem value="body1">Body 1</MenuItem>
                <MenuItem value="body2">Body 2</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={StyledFormControl}>
              <InputLabel>Color</InputLabel>
              <Select
                value={component.properties.color || 'textPrimary'}
                onChange={(e) => handleChange('color', e.target.value)}
              >
                <MenuItem value="textPrimary">Primary</MenuItem>
                <MenuItem value="textSecondary">Secondary</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'button':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Text"
              value={component.properties.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
            <FormControl className={StyledFormControl}>
              <InputLabel>Variant</InputLabel>
              <Select
                value={component.properties.variant || 'contained'}
                onChange={(e) => handleChange('variant', e.target.value)}
              >
                <MenuItem value="contained">Contained</MenuItem>
                <MenuItem value="outlined">Outlined</MenuItem>
                <MenuItem value="text">Text</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={StyledFormControl}>
              <InputLabel>Color</InputLabel>
              <Select
                value={component.properties.color || 'primary'}
                onChange={(e) => handleChange('color', e.target.value)}
              >
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="secondary">Secondary</MenuItem>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={StyledFormControl}>
              <InputLabel>Size</InputLabel>
              <Select
                value={component.properties.size || 'medium'}
                onChange={(e) => handleChange('size', e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'divider':
        return (
          <>
            <FormControl className={StyledFormControl}>
              <InputLabel>Orientation</InputLabel>
              <Select
                value={component.properties.orientation || 'horizontal'}
                onChange={(e) => handleChange('orientation', e.target.value)}
              >
                <MenuItem value="horizontal">Horizontal</MenuItem>
                <MenuItem value="vertical">Vertical</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className={StyledFormControl}
              label="Margin"
              value={component.properties.margin || ''}
              onChange={(e) => handleChange('margin', e.target.value)}
            />
          </>
        );

      case 'icon':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Icon Name"
              value={component.properties.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <FormControl className={StyledFormControl}>
              <InputLabel>Color</InputLabel>
              <Select
                value={component.properties.color || 'primary'}
                onChange={(e) => handleChange('color', e.target.value)}
              >
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="secondary">Secondary</MenuItem>
                <MenuItem value="action">Action</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={StyledFormControl}>
              <InputLabel>Size</InputLabel>
              <Select
                value={component.properties.size || 'medium'}
                onChange={(e) => handleChange('size', e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'image':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Source URL"
              value={component.properties.src || ''}
              onChange={(e) => handleChange('src', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Alt Text"
              value={component.properties.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Width"
              value={component.properties.width || ''}
              onChange={(e) => handleChange('width', e.target.value)}
            />
            <TextField
              className={StyledFormControl}
              label="Height"
              value={component.properties.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
            />
          </>
        );

      case 'table':
        return (
          <>
            <TextField
              className={StyledFormControl}
              label="Headers (comma-separated)"
              value={component.properties.headers || ''}
              onChange={(e) => handleChange('headers', e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={component.properties.pagination || false}
                  onChange={(e) => handleChange('pagination', e.target.checked)}
                />
              }
              label="Enable Pagination"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      {renderPropertyFields()}
      {renderValidationFields()}
    </StyledPaper>
  );
}

export default PropertyEditor;
