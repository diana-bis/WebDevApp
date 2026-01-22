// Routes for video management
const express = require("express");
const videoController = require("../controllers/videoController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Protected routes - require authentication
router.get("/videos", requireAuth, function (req, res) {
    videoController.showVideos(req, res);
});

router.post("/videos/search", requireAuth, function (req, res) {
    videoController.searchYouTube(req, res);
});

router.post("/videos/save", requireAuth, function (req, res) {
    videoController.saveVideo(req, res);
});

router.post("/videos/delete", requireAuth, function (req, res) {
    videoController.deleteVideo(req, res);
});

router.post("/videos/reorder", requireAuth, function (req, res) {
    videoController.reorderVideos(req, res);
});

module.exports = router;
