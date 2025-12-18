import express from 'express';
import {
    clearDatabase,
    getStats,
    getPendingEvents,
    getAllEvents,
    updateEventStatus,
    getAllUsers,
    getAllOrganizers,
    getAdminProfile,
    updateAdminProfile
} from '../controllers/admin_controller.js';

const router = express.Router();

router.delete('/clear-database', clearDatabase);
router.get('/stats', getStats);
router.get('/pending-events', getPendingEvents);
router.get('/events', getAllEvents);
router.put('/events/:id/status', updateEventStatus);
router.get('/users', getAllUsers);
router.get('/organizers', getAllOrganizers);
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

export default router;
