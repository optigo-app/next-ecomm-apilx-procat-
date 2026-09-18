import React from "react";
import { toast } from "react-toastify";

/**
 * Intelligent Toast Formatter
 * Converts any string, React element, or structured object into the rich UI format:
 * - Circular Badge Icon
 * - Bold Title
 * - Subtitle / Description
 * - Action buttons (Retry / Dismiss)
 */
export const formatToastContent = (content, type = "default") => {
  // If already a valid React element
  if (React.isValidElement(content)) {
    return content;
  }

  // If structured object with title/description
  if (typeof content === "object" && content !== null) {
    const {
      title,
      description,
      onRetry,
      retryText = "Retry",
      onDismiss,
      dismissText = "Dismiss",
    } = content;

    return (
      <div className="toast-custom-content">
        {title && <div className="toast-custom-title">{title}</div>}
        {description && <div className="toast-custom-description">{description}</div>}
        {(onRetry || onDismiss) && (
          <div className="toast-custom-actions">
            {onRetry && (
              <button
                type="button"
                className="toast-action-btn primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry();
                }}
              >
                {retryText}
              </button>
            )}
            {onDismiss && (
              <button
                type="button"
                className="toast-action-btn secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
              >
                {dismissText}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // If string or primitive
  const text = String(content || "").trim();
  if (!text) return null;

  let defaultTitle = "";
  let defaultDesc = "";

  if (type === "success") {
    const words = text.split(/\s+/);
    if (words.length <= 3 && !text.includes(",") && !text.includes(".")) {
      defaultTitle = text;
      defaultDesc = "";
    } else {
      defaultTitle = "Success";
      defaultDesc = text;
    }
  } else if (type === "error") {
    if (text.toLowerCase() === "something went wrong" || text.toLowerCase() === "something went wrong!") {
      defaultTitle = "Something went wrong";
      defaultDesc = "We couldn’t complete your request. Check your connection and try again.";
    } else {
      defaultTitle = "Something went wrong";
      defaultDesc = text;
    }
  } else if (type === "info") {
    defaultTitle = "Information";
    defaultDesc = text;
  } else if (type === "warning") {
    defaultTitle = "Warning";
    defaultDesc = text;
  } else {
    defaultTitle = text;
  }

  return (
    <div className="toast-custom-content">
      {defaultTitle && <div className="toast-custom-title">{defaultTitle}</div>}
      {defaultDesc && <div className="toast-custom-description">{defaultDesc}</div>}
    </div>
  );
};

let isEnhanced = false;
export const enhanceGlobalToast = () => {
  if (typeof window === "undefined" || isEnhanced) return;

  const originalSuccess = toast.success.bind(toast);
  const originalError = toast.error.bind(toast);
  const originalInfo = toast.info.bind(toast);
  const originalWarning = toast.warning.bind(toast);

  toast.success = (content, options) => originalSuccess(formatToastContent(content, "success"), options);
  toast.error = (content, options) => originalError(formatToastContent(content, "error"), options);
  toast.info = (content, options) => originalInfo(formatToastContent(content, "info"), options);
  toast.warning = (content, options) => originalWarning(formatToastContent(content, "warning"), options);
  toast.warn = toast.warning;

  isEnhanced = true;
};

export const showToast = {
  success: (content, options) => toast.success(formatToastContent(content, "success"), options),
  error: (content, options) => toast.error(formatToastContent(content, "error"), options),
  info: (content, options) => toast.info(formatToastContent(content, "info"), options),
  warning: (content, options) => toast.warning(formatToastContent(content, "warning"), options),
  default: (content, options) => toast(formatToastContent(content, "default"), options),
};

export default showToast;
