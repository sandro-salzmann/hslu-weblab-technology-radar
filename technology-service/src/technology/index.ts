import { Id } from "../Id";
import { sanitizeText } from "../Sanitizers/sanitizeText";
import { buildMakeTechnology } from "./technology";
import { buildMakeTechnologyPreview } from "./technology-preview";

const makeTechnology = buildMakeTechnology({ Id, sanitizeText });
const makeTechnologyPreview = buildMakeTechnologyPreview({ Id, sanitizeText });

export { makeTechnology, makeTechnologyPreview };
