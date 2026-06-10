import { Router } from "express";
import { searchController } from "../controllers/search.controller";
import { episodesController } from "../controllers/episodes.controller";
import { sourcesController } from "../controllers/sources.controller";
import { validate } from "../middlewares/validation.middleware";
import { searchRequestSchema } from "../validators/search.validator";
import { episodesRequestSchema } from "../validators/episodes.validator";
import { sourcesRequestSchema } from "../validators/sources.validator";

const router = Router();

router.get("/search", validate(searchRequestSchema), searchController);
router.get("/episodes", validate(episodesRequestSchema), episodesController);
router.get("/sources", validate(sourcesRequestSchema), sourcesController);

export default router;
