import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFunction - Function to validate the form
 * @returns {Object} - Form state and helper functions
 */
const useFormValidation = (
  initialValues = {},
  validateFunction = () => ({})
) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * @param {Event} e - The change event
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  /**
   * Handle input blur
   * @param {Event} e - The blur event
   */
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      // Validate the field on blur
      const fieldErrors = validateFunction({ [name]: values[name] });
      if (fieldErrors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: fieldErrors[name],
        }));
      }
    },
    [values, validateFunction]
  );

  /**
   * Set a specific form value
   * @param {string} name - The field name
   * @param {any} value - The field value
   */
  const setValue = useCallback(
    (name, value) => {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      // Clear error when value is set programmatically
      if (errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  /**
   * Reset the form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Validate the entire form
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = useCallback(() => {
    const formErrors = validateFunction(values);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [values, validateFunction]);

  /**
   * Handle form submission
   * @param {Event} e - The submit event
   * @param {Function} onSubmit - The submit handler
   */
  const handleSubmit = useCallback(
    (e, onSubmit) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      const isValid = validateForm();
      if (isValid && onSubmit) {
        onSubmit(values);
      }

      setIsSubmitting(false);
    },
    [values, validateForm]
  );

  /**
   * Get translated error message
   * @param {string} field - The field name
   * @returns {string|null} - The translated error message or null
   */
  const getErrorMessage = useCallback(
    (field) => {
      return errors[field] ? t(errors[field]) : null;
    },
    [errors, t]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
    validateForm,
    getErrorMessage,
  };
};

export default useFormValidation;
