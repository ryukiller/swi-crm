import axios from "axios"

const getPosts = async (client_id, token) => {
    const res = await axios.get(`/api/clienti/${client_id}/social`, {
        params: {
            id: client_id
        },
        headers: {
            authorization: `bearer ${token}`,
        }
    })
    return res.data;
}

const date = new Date("2023-07-12")

const insertPost = async (client_id, token, object) => {
    const res = await axios.post(`/api/clienti/${client_id}/social`, {
        data: {
            client_id: client_id,
            date: object.date,
            type: object.type,
            moodboardlink: object.moodboardlink
        }
    },
        {
            headers: {
                authorization: `bearer ${token}`,
            }
        })

    console.log(res)
}

const deletePost = async (client_id, token, post_id) => {
    const res = await axios.put(`/api/clienti/${client_id}/social`, {
        data: {
            post_id: post_id,
        }
    },
        {
            headers: {
                authorization: `bearer ${token}`,
            }
        })

    console.log(res)
}

const getFeeds = async (client_id, token, social_timeline_id) => {
    const res = await axios.get(`/api/clienti/${client_id}/social/feed`, {
        params: {
            social_timeline_id: social_timeline_id
        },
        headers: {
            authorization: `bearer ${token}`,
        }
    })

    return res.data;
}

const insertFeed = async (client_id, token, social_timeline_id, userid, object) => {
    //social_timeline_id, type, comment, userid, date
    const res = await axios.post(`/api/clienti/${client_id}/social/feed`, {
        data: {
            social_timeline_id: social_timeline_id,
            date: object.date,
            type: object.type,
            userid: userid,
            comment: object.comment
        }
    },
        {
            headers: {
                authorization: `bearer ${token}`,
            }
        })

    console.log(res)
}

const deleteFeed = async (client_id, token, feed_id) => {
    const res = await axios.put(`/api/clienti/${client_id}/social`, {
        data: {
            feed_id: feed_id,
        }
    },
        {
            headers: {
                authorization: `bearer ${token}`,
            }
        })

    console.log(res)
}

const getContent = async (client_id, token, social_timeline_id) => {
    const res = await axios.get(`/api/clienti/${client_id}/social/content`, {
        params: {
            social_timeline_id: social_timeline_id
        },
        headers: {
            authorization: `bearer ${token}`,
        }
    })

    return res.data;
}

const insertContent = async (client_id, token, social_timeline_id, object) => {
    //social_timeline_id, media, description, likes, comments, condivisioni, state
    const res = await axios.post(`/api/clienti/${client_id}/social/content`, {
        data: {
            social_timeline_id: social_timeline_id,
            media: object.media,
            description: object.description,
            likes: object.likes,
            comments: object.comments,
            condivisioni: object.condivisioni,
            state: object.state
        }
    },
        {
            headers: {
                authorization: `bearer ${token}`,
            }
        })

    console.log(res)
}

const deleteContent = async (client_id, token, content_id) => {
    const res = await axios.put(`/api/clienti/${client_id}/social`, {
        data: {
            content_id: content_id,
        }
    },
        {
            headers: {
                authorization: `bearer ${token}`,
            }
        })

    console.log(res)
}

export { getPosts, insertPost, insertFeed, insertContent, deletePost, deleteFeed, deleteContent, getFeeds, getContent };
