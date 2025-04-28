const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validateField = (value, rules = {}, formContext = {}) => {
  // Check conditions first
  if (rules.conditions) {
    const shouldValidate = evaluateConditionGroups(rules.conditions, formContext);
    if (!shouldValidate) {
      return []; // Skip validation if conditions are not met
    }
  }

  return validateRules(value, rules, formContext);
};

const evaluateConditionGroups = (conditions, formContext) => {
  if (!conditions || !Array.isArray(conditions)) return true;

  // If there are no condition groups, treat all conditions as AND
  if (!conditions.some(c => c.group)) {
    return evaluateConditions(conditions, formContext, 'AND');
  }

  // Group conditions by their group name
  const groups = conditions.reduce((acc, condition) => {
    const groupName = condition.group || 'default';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(condition);
    return acc;
  }, {});

  // Evaluate each group (OR between groups)
  return Object.values(groups).some(groupConditions => {
    return evaluateConditions(groupConditions, formContext, 'AND');
  });
};

const evaluateConditions = (conditions, formContext, type = 'AND') => {
  if (!conditions || !Array.isArray(conditions)) return true;

  const evaluator = type === 'AND' ? Array.prototype.every : Array.prototype.some;
  return evaluator.call(conditions, condition => {
    const targetValue = formContext[condition.targetId];
    
    switch (condition.operator) {
      case 'equals':
        return targetValue === condition.value;
      case 'notEquals':
        return targetValue !== condition.value;
      case 'contains':
        return targetValue?.includes(condition.value);
      case 'notContains':
        return !targetValue?.includes(condition.value);
      case 'greaterThan':
        return Number(targetValue) > Number(condition.value);
      case 'lessThan':
        return Number(targetValue) < Number(condition.value);
      case 'isEmpty':
        return !targetValue || targetValue.length === 0;
      case 'isNotEmpty':
        return targetValue && targetValue.length > 0;
      case 'isChecked':
        return targetValue === true;
      case 'isNotChecked':
        return targetValue === false;
      default:
        return true;
    }
  });
};

const validateRules = (value, rules = {}, formContext = {}) => {
  const errors = [];

  if (rules.required && (!value || value.trim() === '')) {
    errors.push('This field is required');
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  if (rules.email && !EMAIL_REGEX.test(value)) {
    errors.push('Must be a valid email address');
  }

  if (rules.url && !URL_REGEX.test(value)) {
    errors.push('Must be a valid URL');
  }

  if (rules.min && Number(value) < rules.min) {
    errors.push(`Must be at least ${rules.min}`);
  }

  if (rules.max && Number(value) > rules.max) {
    errors.push(`Must be no more than ${rules.max}`);
  }

  if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
    errors.push(rules.patternError || 'Invalid format');
  }

  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
};

export const getDefaultValidationRules = (type) => {
  switch (type) {
    case 'email':
      return {
        required: true,
        email: true
      };
    case 'url':
      return {
        required: true,
        url: true
      };
    case 'number':
      return {
        required: true,
        pattern: '^[0-9]*$',
        patternError: 'Must be a valid number'
      };
    case 'phone':
      return {
        required: true,
        pattern: '^[0-9]{10}$',
        patternError: 'Must be a valid 10-digit phone number'
      };
    default:
      return {};
  }
};
