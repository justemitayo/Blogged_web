import { NavigateFunction } from 'react-router-dom';

interface InfoHandlerProps {
  navigate: NavigateFunction;
  success_mssg: string;
  svr_success_mssg?: string;
  proceed_type: number;
  hide_back_btn?: boolean;
  hide_header?: boolean;
}

export const info_handler = ({
  navigate,
  success_mssg,
  svr_success_mssg,
  proceed_type,
  hide_back_btn = false,
  hide_header = false,
}: InfoHandlerProps) => {
  navigate('/info', {
    state: {
      success_mssg,
      svr_success_mssg,
      proceed_type,
      hide_back_btn,
      hide_header,
    },
  });
};
