import { Router } from "express";
import { searchController } from "../controllers/search.controller";
import { episodeController } from "../controllers/episodes.controller";

const router = Router();

router.get("/search", searchController);
router.post("/episodes", episodeController);

export default router;
