// Repository for video database operations
const db = require("../config/db");
const Video = require("../models/video");

class VideoRepository {
    // Get all videos for a user
    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM Videos WHERE userId = ? ORDER BY position ASC, savedAt DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows ? rows.map(row => new Video(row)) : []);
                }
            );
        });
    }

    // Get single video by id
    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM Videos WHERE id = ?`,
                [id],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row ? new Video(row) : null);
                }
            );
        });
    }

    // Create new favorite video
    async create({ userId, videoTitle, videoId, thumbnailUrl, description }) {
        const savedAt = new Date().toISOString();

        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Videos (userId, videoTitle, videoId, thumbnailUrl, description, savedAt, position) 
                 VALUES (?, ?, ?, ?, ?, ?, 0)`,
                [userId, videoTitle, videoId, thumbnailUrl, description, savedAt],
                function (err) {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed")) {
                            return reject(new Error("Video already saved in favorites"));
                        }
                        return reject(err);
                    }
                    resolve(
                        new Video({
                            id: this.lastID,
                            userId,
                            videoTitle,
                            videoId,
                            thumbnailUrl,
                            description,
                            savedAt,
                            position: 0,
                        })
                    );
                }
            );
        });
    }

    // Delete video from favorites
    async delete(id, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM Videos WHERE id = ? AND userId = ?`,
                [id, userId],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }

    // Update position for reordering
    async updatePosition(id, position) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE Videos SET position = ? WHERE id = ?`,
                [position, id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }

    // Reorder videos
    async reorder(videos) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let completed = 0;
                videos.forEach(({ id, position }, index) => {
                    db.run(
                        `UPDATE Videos SET position = ? WHERE id = ?`,
                        [index, id],
                        (err) => {
                            if (err) return reject(err);
                            completed++;
                            if (completed === videos.length) {
                                resolve(true);
                            }
                        }
                    );
                });
            });
        });
    }
}

module.exports = new VideoRepository();
