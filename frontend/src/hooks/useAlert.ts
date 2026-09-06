import Swal, { SweetAlertOptions, SweetAlertIcon } from 'sweetalert2';
import { useCallback } from 'react';

export const useAlert = () => {
  const defaultOptions: SweetAlertOptions = {
    background: 'transparent', 
    backdrop: 'rgba(0, 0, 0, 0.4)',
    buttonsStyling: false, 
    customClass: {
      popup: 'bg-background border border-border/50 shadow-2xl rounded-3xl p-6 backdrop-blur-xl',
      title: 'text-2xl font-bold text-text-main mt-4',
      htmlContainer: 'text-text-muted font-medium text-sm mt-2',
      confirmButton: 'clay-btn px-8 py-3 font-bold bg-primary text-white rounded-xl mx-2 flex items-center justify-center',
      cancelButton: 'px-8 py-3 rounded-xl font-bold text-text-main bg-background hover:bg-border/50 border border-border transition-colors mx-2 flex items-center justify-center',
      actions: 'mt-8 flex justify-center w-full',
      icon: 'mt-4',
    }
  };

  const fireAlert = useCallback((options: SweetAlertOptions) => {
    return Swal.fire({ ...defaultOptions, ...options } as SweetAlertOptions);
  }, []);

  // 1. Success Message
  const showSuccess = useCallback((title: string, text?: string) => {
    return fireAlert({ title, text, icon: 'success', confirmButtonText: 'Great!' });
  }, [fireAlert]);

  // 2. Error Message
  const showError = useCallback((title: string, text?: string) => {
    return fireAlert({ title, text, icon: 'error', confirmButtonText: 'Try Again' });
  }, [fireAlert]);

  // 3. Warning / Info Message
  const showInfo = useCallback((title: string, text?: string) => {
    return fireAlert({ title, text, icon: 'info', confirmButtonText: 'Got it' });
  }, [fireAlert]);

  // 4. Confirmation Dialog 
  const confirmAction = useCallback(async (
    title: string, 
    text: string, 
    confirmText: string = 'Yes, do it!', 
    cancelText: string = 'Cancel'
  ): Promise<boolean> => {
    const result = await fireAlert({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: {
        ...defaultOptions.customClass,
        confirmButton: 'px-8 py-3 font-bold text-white rounded-xl mx-2 flex items-center justify-center bg-error shadow-lg shadow-error/30 hover:bg-red-600 transition-colors',
      }
    });
    return result.isConfirmed;
  }, [fireAlert]);

  const toast = useCallback((title: string, icon: SweetAlertIcon = 'success') => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: 'var(--color-background)', 
      color: 'var(--color-text-main)',
      customClass: {
        popup: 'border border-border/50 shadow-lg rounded-xl',
      }
    });
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    confirmAction,
    toast,
    fireCustom: fireAlert
  };
};