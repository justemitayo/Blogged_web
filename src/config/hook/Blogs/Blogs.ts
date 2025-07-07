import Axios from 'axios';
import { base_url } from '../Base/Base_URL';
import { error_translator } from '../../../utils/Error_Converter/Error_Converter';


const api_base_url = Axios.create({
    baseURL: base_url,
});

export const create_blog = async ({
    user_token,
    title,
    message,
    displayPicture,
    tags,
}: {
    user_token: string;
    title: string;
    message: string;
    displayPicture: string;
    tags?: number[];
}) => {
    return await api_base_url
        .post('blogs/create', {
            title: title,
            message: message,
            dp: displayPicture,
            tags: tags || [],
            headers: {
                'x-access-token': user_token,
            },
        })
        ?.catch(err => {
            return {
                error: true,
                data: err?.message,
            };
        })
        ?.then((res: any) => {
            if (res?.status === 'error') {
                return {
                    error: true,
                    data: res?.data,
                };
            } else {
                if (res?.data?.status === 'success') {
                    return {
                        error: false,
                        data: 'success',
                    };
                } else if (res?.data?.status === 'error') {
                    return {
                        error: true,
                        data: `Error: ${error_translator({
                            code: res?.data?.code,
                        })}`,
                    };
                } else {
                    return {
                        error: true,
                        data: 'An error occured. Please check your Internet Connectivity and try again!',
                    };
                }
            }
        });
};

export const edit_blog = async ({
    user_token,
    blogID,
    title,
    message,
    displayPicture,
    tags,
}: {
    user_token: string;
    blogID: string;
    title: string;
    message: string;
    displayPicture: string;
    tags: number[];
}) => {
    return await api_base_url
        .patch('blogs/edit', {
            bid: blogID,
            title: title,
            message: message,
            dp: displayPicture,
            tags: tags,
            headers: {
                'x-access-token': user_token,
            },
        })
        ?.catch(err => {
            return {
                error: true,
                data: err?.message,
            };
        })
        ?.then((res: any) => {
            if (res?.status === 'error') {
                return {
                    error: true,
                    data: res?.data,
                };
            } else {
                if (res?.data?.status === 'success') {
                    return {
                        error: false,
                        data: 'success',
                    };
                } else if (res?.data?.status === 'error') {
                    return {
                        error: true,
                        data: `Error: ${error_translator({
                            code: res?.data?.code,
                        })}`,
                    };
                } else {
                    return {
                        error: true,
                        data: 'An error occured. Please check your Internet Connectivity and try again!',
                    };
                }
            }
        });
};

export const delete_blog = async ({
    user_token,
    blogID,
}: {
    user_token: string;
    blogID: string;
}) => {
    return await api_base_url
        .delete('blogs/delete', {
            headers: {
                'x-access-token': user_token,
                bid: blogID,
            },
        })
        ?.catch(err => {
            return {
                error: true,
                data: err?.message,
            };
        })
        ?.then((res: any) => {
            if (res?.status === 'error') {
                return {
                    error: true,
                    data: res?.data,
                };
            } else {
                if (res?.data?.status === 'success') {
                    return {
                        error: false,
                        data: 'success',
                    };
                } else if (res?.data?.status === 'error') {
                    return {
                        error: true,
                        data: `Error: ${error_translator({
                            code: res?.data?.code,
                        })}`,
                    };
                } else {
                    return {
                        error: true,
                        data: 'An error occured. Please check your Internet Connectivity and try again!',
                    };
                }
            }
        });
};