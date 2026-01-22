// Controller for video operations
const videoService = require("../services/videoService");

class VideoController {
    // Show videos page
    async showVideos(req, res) {
        try {
            const videos = await videoService.getMyVideos(req.session.user.id);
            res.render("videos", {
                videos,
                error: null,
                success: null
            });
        } catch (err) {
            res.status(400).render("videos", {
                videos: [],
                error: err.message,
                success: null
            });
        }
    }

    // Search YouTube videos
    async searchYouTube(req, res) {
        try {
            const { q } = req.body;

            const videos = await videoService.searchYouTube(q);

            res.json({ success: true, videos });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }

    // Save a video to favorites
    async saveVideo(req, res) {
        try {
            const { videoTitle, videoId, thumbnailUrl, description } = req.body;

            await videoService.saveVideo({
                userId: req.session.user.id,
                videoTitle,
                videoId,
                thumbnailUrl,
                description,
            });

            res.json({ success: true, message: "Video saved to favorites!" });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }

    // Delete a video from favorites
    async deleteVideo(req, res) {
        try {
            const { videoId } = req.body;

            await videoService.deleteVideo(videoId, req.session.user.id);

            res.json({ success: true, message: "Video removed from favorites!" });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }

    // Reorder videos
    async reorderVideos(req, res) {
        try {
            const { videoOrder } = req.body;

            await videoService.reorderVideos(videoOrder);

            const videos = await videoService.getMyVideos(req.session.user.id);
            res.json({ success: true, videos });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
}

module.exports = new VideoController();
