import React from 'react';

const ActionModal = ({
  show = false,
  type = 'info', // 'success', 'error', 'info', 'warning', 'confirm'
  title = '',
  message = '',
  onClose = () => {},
  onConfirm = null,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  showCancelButton = false
}) => {
  if (!show) return null;

  // Configuración de estilos según el tipo
  const getModalStyles = () => {
    const baseClasses = {
      container: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50",
      modal: "bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all",
      header: "flex items-center p-4 border-b",
      icon: "text-2xl mr-3",
      body: "p-4",
      footer: "flex justify-end p-4 border-t space-x-2"
    };

    const typeStyles = {
      success: {
        header: "border-green-200 bg-green-50",
        icon: "text-green-500",
        title: "text-green-800 font-semibold",
        confirmButton: "bg-green-500 hover:bg-green-600 text-white"
      },
      error: {
        header: "border-red-200 bg-red-50",
        icon: "text-red-500",
        title: "text-red-800 font-semibold",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white"
      },
      warning: {
        header: "border-yellow-200 bg-yellow-50",
        icon: "text-yellow-500",
        title: "text-yellow-800 font-semibold",
        confirmButton: "bg-yellow-500 hover:bg-yellow-600 text-white"
      },
      info: {
        header: "border-blue-200 bg-blue-50",
        icon: "text-blue-500",
        title: "text-blue-800 font-semibold",
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white"
      },
      confirm: {
        header: "border-gray-200 bg-gray-50",
        icon: "text-gray-500",
        title: "text-gray-800 font-semibold",
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white"
      }
    };

    return { ...baseClasses, ...typeStyles[type] };
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'confirm':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  const styles = getModalStyles();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.container}
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={`${styles.header} ${styles.header}`}>
          <span className={`${styles.icon} ${styles.icon}`}>
            {getIcon()}
          </span>
          <h3 className={`text-lg ${styles.title}`}>
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className="text-gray-700 whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {showCancelButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;