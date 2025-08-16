import { INTF_BlogPost } from "../../Interface/Blog_Post";

export const update_blog_posts = ({
    old_data,
    blog_id,
    blog_title,
    blog_tags,
}: {
    old_data: {
        pageParams: any[];
        pages: { data: INTF_BlogPost[]; error: boolean }[];
    };
    blog_id: string;
    blog_title: string;
    blog_tags: number[];
}) => {
    const updated_data = old_data.pages.map(page => {
        const new_data = page.data.map(item => {
            if (item?.bid === blog_id) {
                return {
                    ...item,
                    title: blog_title,
                    tags: blog_tags,
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
