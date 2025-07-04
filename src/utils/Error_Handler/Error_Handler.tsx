import { NavigateFunction } from 'react-router-dom';

interface ErrorHandlerProps {
  navigate: NavigateFunction;
  error_mssg: string;
  svr_error_mssg?: string;
}

export const error_handler = ({
  navigate,
  error_mssg,
  svr_error_mssg,
}: ErrorHandlerProps) => {
  navigate('/error', {
    state: {
      error_mssg,
      svr_error_mssg,
    },
  });
};

