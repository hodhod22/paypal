import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import LocalizedForm from "./LocalizedForm";
import LocalizedInput from "./LocalizedInput";
import LocalizedSelect from "./LocalizedSelect";
import LocalizedTextArea from "./LocalizedTextArea";
import LocalizedButton from "./LocalizedButton";
import LocalizedErrorMessage from "./LocalizedErrorMessage";

/**
 * A declarative form builder component that creates localized forms
 * from a configuration object
 *
 * @param {Object} props - Component props
 * @param {Object} props.formConfig - Form configuration object (deprecated, use config instead)
 * @param {Object} props.config - Form configuration object
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Submit handler
 * @param {boolean} props.loading - Whether the form is loading
 * @param {string} props.error - Form error message
 * @param {string} props.successMessage - Success message
 * @param {string} props.className - Additional class names
 */
const LocalizedFormBuilder = ({
  formConfig,
  config,
  initialValues = {},
  onSubmit,
  loading = false,
  error = null,
  successMessage = null,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  // Use config if provided, otherwise use formConfig (for backward compatibility)
  const formConfiguration = config || formConfig || {};

  // Extract form configuration
  const {
    title,
    description,
    fields = [],
    submitText,
    loadingText,
    submitButton = {},
    validate = () => ({}),
    layout = "vertical", // vertical, horizontal, grid
    columns = 1, // For grid layout
    onSubmit: configOnSubmit,
    initialValues: configInitialValues,
  } = formConfiguration;

  // Use values from config if provided, otherwise use props (for backward compatibility)
  const formInitialValues = configInitialValues || initialValues;
  const formOnSubmit = configOnSubmit || onSubmit;
  const formSubmitText = submitButton.text || submitText || "common.submit";
  const formLoadingText =
    submitButton.loadingText || loadingText || "common.loading";

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

  // Determine layout class
  const layoutClasses = {
    vertical: "space-y-4",
    horizontal: "flex flex-wrap gap-4",
    grid: `grid grid-cols-1 md:grid-cols-${columns} gap-4`,
  };

  // Render a field based on its type
  const renderField = (field) => {
    const {
      type,
      name,
      label,
      placeholder,
      options,
      required = false,
      rows,
      min,
      max,
      step,
      autoComplete,
      className = "",
      hidden = () => false,
      disabled = false,
      readOnly = false,
      dir,
      ...fieldProps
    } = field;

    // Check if field should be hidden
    const isHidden = typeof hidden === "function" ? hidden() : hidden;
    if (isHidden) return null;

    // Common props for all field types
    const commonProps = {
      name,
      label,
      placeholder,
      required,
      disabled,
      readOnly,
      className,
      dir,
      ...fieldProps,
    };

    // Render field based on type
    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "tel":
      case "url":
      case "date":
      case "time":
      case "datetime-local":
        return (
          <LocalizedInput
            type={type}
            {...commonProps}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
          />
        );
      case "select":
        return <LocalizedSelect {...commonProps} options={options} />;
      case "textarea":
        return <LocalizedTextArea {...commonProps} rows={rows || 3} />;
      case "custom":
        return field.render ? field.render(commonProps) : null;
      default:
        return <LocalizedInput type="text" {...commonProps} />;
    }
  };

  return (
    <div
      className={`${
        isRTL() ? "rtl-form" : ""
      } ${getLanguageFontClass()} ${className}`}
    >
      {title && <h2 className="text-xl font-bold mb-4">{t(title)}</h2>}
      {description && <p className="mb-4">{t(description)}</p>}

      <LocalizedForm
        initialValues={formInitialValues}
        validate={validate}
        onSubmit={formOnSubmit}
        submitText={formSubmitText}
        loadingText={formLoadingText}
        loading={loading}
        error={error}
        successMessage={successMessage}
        className={layoutClasses[layout] || layoutClasses.vertical}
        {...rest}
      >
        {fields.map((field) => (
          <div key={field.name} className={field.wrapperClassName || ""}>
            {renderField(field)}
          </div>
        ))}
      </LocalizedForm>
    </div>
  );
};

export default LocalizedFormBuilder;
