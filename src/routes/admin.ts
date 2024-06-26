import { Router } from "express";
import * as auth from "../controllers/auth";
import * as events from "../controllers/events";

const router = Router();

router.get('/ping', auth.validate, (req, res) => {
    res.json({pong: true, admin:true});
});

router.post('/login', auth.login);
router.get('/events', auth.validate, events.getAll);
router.post("/events", auth.validate, events.addEvent);
router.get('/events/:id', auth.validate, events.getEvent)
router.put("/events/:id", auth.validate, events.updateEvent);
router.delete("/events/:id", auth.validate, events.deleteEvent);

export default router;

