import { v4 as uuidv4 } from "uuid";
import validator from "validator";

export interface IdUtils {
  makeId: () => string;
  isValidId: (id: string) => boolean;
}

export const Id: IdUtils = Object.freeze({
  makeId: () => uuidv4(),
  isValidId: (string: string) => validator.isUUID(string),
});
