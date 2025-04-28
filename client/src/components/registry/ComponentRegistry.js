import { createElement } from 'react';

class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.metadata = new Map();
  }

  register(type, component, metadata = {}) {
    this.components.set(type, component);
    this.metadata.set(type, {
      name: metadata.name || type,
      icon: metadata.icon,
      category: metadata.category || 'Basic',
      properties: metadata.properties || [],
      validation: metadata.validation || [],
      events: metadata.events || [],
      styleProperties: metadata.styleProperties || [],
      ...metadata
    });
  }

  create(type, props) {
    const Component = this.components.get(type);
    if (!Component) {
      throw new Error(`Component type "${type}" not found in registry`);
    }
    return createElement(Component, props);
  }

  getMetadata(type) {
    return this.metadata.get(type);
  }

  getAllComponents() {
    return Array.from(this.components.keys()).map(type => ({
      type,
      ...this.getMetadata(type)
    }));
  }

  getComponentsByCategory() {
    const categories = new Map();
    this.metadata.forEach((metadata, type) => {
      const category = metadata.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push({
        type,
        ...metadata
      });
    });
    return Object.fromEntries(categories);
  }
}

export default new ComponentRegistry();
