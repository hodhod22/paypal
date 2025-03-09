import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import LocalizedButton from "./LocalizedButton";
import LocalizedErrorMessage from "./LocalizedErrorMessage";
import useFormValidation from "../hooks/useFormValidation";

/**
 * A language-aware form component that adapts to the current language
 * and provides built-in validation and error handling
 *
 * @param {Object} props - Component props
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.validate - Validation function
 * @param {Function} props.onSubmit - Submit handler
 * @param {ReactNode} props.children - Form fields
 * @param {string} props.submitText - Submit button text (translation key)
 * @param {string} props.loadingText - Loading text (translation key)
 * @param {boolean} props.loading - Whether the form is loading
 * @param {string} props.error - Form error message
 * @param {string} props.successMessage - Success message
 * @param {string} props.className - Additional class names
 */
const LocalizedForm = ({
  initialValues = {},
  validate,
  onSubmit,
  children,
  submitText = "common.submit",
  loadingText = "common.loading",
  loading = false,
  error = null,
  successMessage = null,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  // Use the form validation hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
    getErrorMessage,
  } = useFormValidation(initialValues, validate);

  // Get language-specific font class
  const getLanguageFontClass = () => {
    switch (currentLanguage) {
      case "fa":
        return "font-fa";
      case "ar":
        return "font-ar";
      case "tr":
        return "font-tr";
      case "sv":
        return "font-sv";
      default:
        return "";
    }
  };

  // Clone children and inject form props
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      // Skip if child is not a valid element
      if (!React.isValidElement(child)) return child;

      // Get the field name from the child props
      const fieldName = child.props.name;

      // Skip if the child doesn't have a name prop
      if (!fieldName) return child;

      // Inject form props into the child
      return React.cloneElement(child, {
        value: values[fieldName] || "",
        onChange: handleChange,
        onBlur: handleBlur,
        error:
          touched[fieldName] && errors[fieldName]
            ? getErrorMessage(fieldName)
            : null,
        dir: child.props.dir || (isRTL() ? "rtl" : "ltr"),
      });
    });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    handleSubmit(e, (formValues) => {
      if (onSubmit) {
        onSubmit(formValues, { resetForm });
      }
    });
  };

  return (
    <div
      className={`${
        isRTL() ? "rtl-form" : ""
      } ${getLanguageFontClass()} ${className}`}
    >
      {error && (
        <LocalizedErrorMessage
          message={error}
          variant="error"
          className="mb-4"
          dismissible
        />
      )}

      {successMessage && (
        <LocalizedErrorMessage
          message={successMessage}
          variant="success"
          className="mb-4"
          dismissible
        />
      )}

      <form
        onSubmit={handleFormSubmit}
        className="space-y-4"
        dir={isRTL() ? "rtl" : "ltr"}
        {...rest}
      >
        {renderChildren()}

        <LocalizedButton
          type="submit"
          text={loading ? loadingText : submitText}
          isLoading={loading}
          disabled={loading}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default LocalizedForm;
