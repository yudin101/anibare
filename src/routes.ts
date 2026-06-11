import { Router } from "express";
import {
  searchController,
  episodesController,
  sourcesController,
} from "./controllers";
import { validate } from "./middlewares/validation.middleware";
import {
  searchRequestSchema,
  episodesRequestSchema,
  sourcesRequestSchema,
} from "./validators";

const router = Router();

router.get("/search", validate(searchRequestSchema), searchController);
router.get("/episodes", validate(episodesRequestSchema), episodesController);
router.get("/sources", validate(sourcesRequestSchema), sourcesController);

export default router;
