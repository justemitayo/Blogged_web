import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';

interface ErrorHandlerProps {
  navigate: NavigateFunction;
  error_mssg: any;       
  svr_error_mssg?: any;
}

export const error_handler = ({
  navigate,       
  error_mssg,
  svr_error_mssg,
}: ErrorHandlerProps) => {
  let finalMessage = svr_error_mssg || error_mssg;

  // If it's an object (like { message: 'Invalid' }), extract message
  if (typeof finalMessage === 'object') {
    if ('message' in finalMessage) {
      finalMessage = finalMessage.message;
    } else {
      finalMessage = JSON.stringify(finalMessage);
    }
  }

  toast.error(finalMessage ?? 'An unknown error occurred', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};
