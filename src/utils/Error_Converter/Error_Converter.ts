import { blogged_errors } from '../../data/Errors/Errors';

export const error_translator = ({ code }: { code: string }) => {
    const error = blogged_errors?.filter(item => item?.code === code);
    return error[0]?.message;
};
