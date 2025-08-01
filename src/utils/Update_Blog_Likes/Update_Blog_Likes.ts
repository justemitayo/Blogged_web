import { INTF_BlogPost } from '../../Interface/Blog_Post';

export const update_blog_likes = ({
    old_data,
    blog_id,
    increase,
}: {
    old_data: {
        pageParams: any[];
        pages: { data: INTF_BlogPost[]; error: boolean }[];
    };
    blog_id: string;
    increase: boolean;
}) => {
    const updated_data = old_data.pages.map(page => {
        const new_data = page.data.map(item => {
            if (item?.bid === blog_id) {
                return {
                    ...item,
                    liked: true,
                    likes_l: increase
                        ? (item?.likes_l as number) + 1 <= 0
                            ? 1
                            : (item?.likes_l as number) + 1
                        : (item?.likes_l as number) - 1 <= 0
                        ? 0
                        : (item?.likes_l as number) - 1,
                };
            }
            return item;
        });
        return {
            ...page,
            data: new_data,
        };
    });

    return { ...old_data, pages: updated_data };
};
