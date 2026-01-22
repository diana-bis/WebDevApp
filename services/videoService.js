// Service layer for video operations
const videoRepo = require("../repositories/videoRepository");
const fetch = require("node-fetch");

class VideoService {
    async searchYouTube(query) {
        if (!query || !query.trim()) {
            throw new Error("Search query is required");
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            throw new Error("Missing YOUTUBE_API_KEY in .env");
        }

        const url =
            `https://www.googleapis.com/youtube/v3/search` +
            `?part=snippet&type=video&maxResults=10` +
            `&q=${encodeURIComponent(query)}` +
            `&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            // YouTube sends helpful error messages in data.error
            const msg = data?.error?.message || "YouTube API request failed";
            throw new Error(msg);
        }

        // Return a clean list your controller/view can use
        return data.items.map(item => ({
            videoId: item.id.videoId,
            videoTitle: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails?.medium?.url,
            description: item.snippet.description,
        }));
    }

    async getMyVideos(userId) {
        return await videoRepo.findByUserId(userId);
    }

    async saveVideo({ userId, videoTitle, videoId, thumbnailUrl, description }) {
        if (!videoTitle || !videoId) {
            throw new Error("Video title and ID are required");
        }

        return await videoRepo.create({
            userId,
            videoTitle,
            videoId,
            thumbnailUrl,
            description,
        });
    }

    async deleteVideo(videoId, userId) {
        const video = await videoRepo.findById(videoId);
        if (!video || video.userId !== userId) {
            throw new Error("Video not found or unauthorized");
        }

        return await videoRepo.delete(videoId, userId);
    }

    async reorderVideos(videoOrder) {
        // videoOrder should be an array of {id, position}
        return await videoRepo.reorder(videoOrder);
    }
}

module.exports = new VideoService();
