import { Router } from "express";
import {
  searchController,
  episodesController,
  sourcesController,
  videoProxyController,
} from "./controllers";
import { validate } from "./middlewares/validation.middleware";
import {
  searchRequestSchema,
  episodesRequestSchema,
  sourcesRequestSchema,
  videoProxyRequestSchema,
} from "./validators";

const router = Router();

router.get("/search", validate(searchRequestSchema), searchController);
router.get("/episodes", validate(episodesRequestSchema), episodesController);
router.get("/sources", validate(sourcesRequestSchema), sourcesController);
router.get("/stream", validate(videoProxyRequestSchema), videoProxyController);

export default router;
