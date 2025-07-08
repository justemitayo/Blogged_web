import Axios from 'axios';
import { base_url } from '../Base/Base_URL';
import { error_translator } from '../../../utils/Error_Converter/Error_Converter';

const api_base_url = Axios.create({
    baseURL: base_url,
});

export const sign_in = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await api_base_url
      .post('users/auth/signin', {
          email: email,
          password: password,
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
                      data: res?.data?.response,
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

export const sign_up = async ({
    email,
    username,
    password,
    displayPicture,
}: {
    email: string;
    username: string;
    password: string;
    displayPicture: string;
}) => {
    return await api_base_url
        .post('users/auth/signup', {
            email: email,
            username: username,
            password: password,
            dp: displayPicture,
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
                        data: res?.data?.response,
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

export const delete_account = async ({
    user_token,
}: {
    user_token: string;
}) => {
    return await api_base_url
        .delete('users/delete', {
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

export const update_display_picture = async ({
    user_token,
    displayPicture,
}: {
    user_token: string;
    displayPicture: string;
}) => {
    return await api_base_url
        .patch('users/updatedp', {
            dp: displayPicture,
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
