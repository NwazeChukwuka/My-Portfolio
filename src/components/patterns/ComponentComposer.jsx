/**
 * Component Composer - Advanced composition patterns
 * Provides flexible component building blocks
 */
import React from 'react';

/**
 * Compound Component Pattern
 * Allows components to be composed together
 */
export function createCompoundComponent(components) {
  const Compound = ({ children, ...props }) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { ...props, ...child.props });
      }
      return child;
    });
  };

  // Add all sub-components to the compound component
  Object.entries(components).forEach(([name, Component]) => {
    Compound[name] = React.forwardRef((props, ref) => <Component ref={ref} {...props} />);
  });

  return Compound;
}

/**
 * Slot Pattern - Flexible content placement
 */
export const Slot = ({ name, children, fallback = null, className, ...props }) => {
  const slotChildren = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.slot === name
  );

  return (
    <div className={cn('slot', className)} {...props}>
      {slotChildren || fallback}
    </div>
  );
};

export const SlotContent = ({ slot, children, ...props }) => {
  return React.cloneElement(children, { slot, ...props });
};

/**
 * Provider Pattern - Context-based composition
 */
export function createProvider(defaultValue) {
  const Context = React.createContext(defaultValue);
  
  const Provider = ({ value, children }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  
  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error('useContext must be used within a Provider');
    }
    return context;
  };
  
  return [Provider, useContext];
}

/**
 * Render Props Pattern
 */
export const RenderProps = ({ render, children, ...props }) => {
  return render ? render(props) : children(props);
};

/**
 * Children as Function Pattern
 */
export const ChildrenAsFunction = ({ children, ...props }) => {
  return typeof children === 'function' ? children(props) : children;
};

/**
 * Configurable Component Pattern
 */
export function createConfigurableComponent(defaultConfig) {
  return function ConfigurableComponent({ config = {}, ...props }) {
    const finalConfig = { ...defaultConfig, ...config };
    return <div data-config={JSON.stringify(finalConfig)} {...props} />;
  };
}

/**
 * Polymorphic Component Pattern
 */
export const Polymorphic = ({ as: Component = 'div', children, ...props }) => {
  return <Component {...props}>{children}</Component>;
};

/**
 * Headless UI Pattern - Logic without UI
 */
export function createHeadlessComponent(logic) {
  return function HeadlessComponent({ children, ...props }) {
    const state = logic(props);
    return children(state);
  };
}

/**
 * State Reducer Pattern
 */
export function useReducerState(reducer, initialState) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  const actions = React.useMemo(() => {
    const actionCreators = {};
    
    // Auto-generate action creators from reducer
    const reducerString = reducer.toString();
    const actionMatches = reducerString.match(/case\s+['"]([^'"]+)['"]/g);
    
    if (actionMatches) {
      actionMatches.forEach((match) => {
        const actionType = match.match(/['"]([^'"]+)['"]/)[1];
        actionCreators[actionType] = (payload) => dispatch({ type: actionType, payload });
      });
    }
    
    return actionCreators;
  }, [dispatch]);
  
  return [state, actions, dispatch];
}

/**
 * Conditional Rendering Pattern
 */
export const Conditional = ({ 
  when, 
  children, 
  fallback = null, 
  wrapper = React.Fragment 
}) => {
  const Wrapper = wrapper;
  return when ? <Wrapper>{children}</Wrapper> : fallback;
};

export const Switch = ({ children }) => {
  const cases = React.Children.toArray(children);
  
  for (const caseElement of cases) {
    if (React.isValidElement(caseElement) && caseElement.props.when) {
      return caseElement.props.children;
    }
  }
  
  // Find default case
  for (const caseElement of cases) {
    if (React.isValidElement(caseElement) && caseElement.props.default) {
      return caseElement.props.children;
    }
  }
  
  return null;
};

export const Case = ({ children }) => children;

export const Default = ({ children }) => children;

/**
 * List Pattern - Consistent list rendering
 */
export const List = ({ 
  items, 
  renderItem, 
  keyExtractor, 
  emptyState = null,
  loading = false,
  loadingState = null,
  className,
  ...props 
}) => {
  if (loading) {
    return loadingState || <div className={cn('list-loading', className)} {...props} />;
  }
  
  if (!items || items.length === 0) {
    return emptyState || <div className={cn('list-empty', className)} {...props} />;
  }
  
  return (
    <div className={cn('list', className)} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Field Pattern - Consistent form field rendering
 */
export const Field = ({ 
  label, 
  error, 
  required = false, 
  description, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn('field', className)} {...props}>
      {label && (
        <label className="field__label">
          {label}
          {required && <span className="field__required">*</span>}
        </label>
      )}
      
      {description && (
        <p className="field__description">{description}</p>
      )}
      
      <div className="field__input">
        {children}
      </div>
      
      {error && (
        <p className="field__error">{error}</p>
      )}
    </div>
  );
};

/**
 * Card Pattern - Consistent card rendering
 */
export const Card = ({ 
  header, 
  footer, 
  children, 
  variant = 'default',
  elevated = false,
  className,
  ...props 
}) => {
  const variantClass = `card--${variant}`;
  const elevatedClass = elevated ? 'card--elevated' : '';
  
  return (
    <div 
      className={cn('card', variantClass, elevatedClass, className)} 
      {...props}
    >
      {header && (
        <div className="card__header">
          {header}
        </div>
      )}
      
      <div className="card__content">
        {children}
      </div>
      
      {footer && (
        <div className="card__footer">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * Modal Pattern - Consistent modal rendering
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'medium',
  closeOnOverlayClick = true,
  className,
  ...props 
}) => {
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={cn('modal', `modal--${size}`, className)} 
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <button 
          className="modal__close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Helper function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default {
  createCompoundComponent,
  Slot,
  SlotContent,
  createProvider,
  RenderProps,
  ChildrenAsFunction,
  createConfigurableComponent,
  Polymorphic,
  createHeadlessComponent,
  useReducerState,
  Conditional,
  Switch,
  Case,
  Default,
  List,
  Field,
  Card,
  Modal,
};
