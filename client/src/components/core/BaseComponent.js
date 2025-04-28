import React from 'react';
import PropTypes from 'prop-types';

class BaseComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    properties: PropTypes.object,
    style: PropTypes.object,
    validation: PropTypes.object,
    children: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      validationMessage: '',
    };
  }

  validate() {
    const { validation, properties } = this.props;
    if (!validation) return true;

    let isValid = true;
    let message = '';

    // Required field validation
    if (validation.required && !properties.value) {
      isValid = false;
      message = 'This field is required';
    }

    // Custom validation rules
    if (validation.rules) {
      validation.rules.forEach(rule => {
        if (!rule.validate(properties.value)) {
          isValid = false;
          message = rule.message;
        }
      });
    }

    this.setState({ isValid, validationMessage: message });
    return isValid;
  }

  getComputedStyle() {
    const { style = {} } = this.props;
    return {
      width: style.width || 'auto',
      height: style.height || 'auto',
      minWidth: style.minWidth,
      minHeight: style.minHeight,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      ...style,
    };
  }
}

export default BaseComponent;
