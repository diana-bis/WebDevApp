// Video model for YouTube favorites
class Video {
    constructor({ id, userId, videoTitle, videoId, thumbnailUrl, description, savedAt, position }) {
        this.id = id;
        this.userId = userId;
        this.videoTitle = videoTitle;
        this.videoId = videoId;
        this.thumbnailUrl = thumbnailUrl;
        this.description = description;
        this.savedAt = savedAt;
        this.position = position || 0;
    }
}

module.exports = Video;
