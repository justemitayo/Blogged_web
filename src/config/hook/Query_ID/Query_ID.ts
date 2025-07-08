export const query_id = ({ id }: { id?: any }) => {
    return {
        blogs: ['blogs'],
        tags: ['tags'],
        adverts: ['adverts'],
        authors: ['authors'],
        foryoublogs: ['blogs', 'foryou'],
        trendingblogs: ['blogs', 'trending'],
        blog_with_id: ['blogs', id],
        user_with_id: ['users', id],
        blog_with_id_likes: ['blogs', 'likes', id],
        author_blogs_with_id: ['author', 'blogs', id],
        author_followers_with_id: ['author', 'followers', id],
        author_followings_with_id: ['author', 'followings', id],
    };
};
