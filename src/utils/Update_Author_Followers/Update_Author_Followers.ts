import { INTF_AuthorDesc } from "../../Interface/Author_Desc";

export const update_author_followers = ({
    old_data,
    increase,
    blog_id,
}: {
    old_data: {
        pageParams: any[];
        pages: { data: INTF_AuthorDesc[]; error: boolean }[];
    };
    increase: boolean;
    blog_id: string;
}) => {
    const updated_data = old_data.pages.map(page => {
        const new_data = page.data.map(item => {
            if (item.uid === blog_id) {
                return {
                    ...item,
                    followed: increase ? true : false,
                    followers: increase
                        ? (item?.followers as number) + 1 <= 0
                            ? 1
                            : (item?.followers as number) + 1
                        : (item?.followers as number) - 1 <= 0
                        ? 0
                        : (item?.followers as number) - 1,
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
