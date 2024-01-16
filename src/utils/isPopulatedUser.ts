import mongoose from "mongoose";
import { IPopulatedUser } from "../inputs/messageMutationTypes";

export function isPopulatedUser(user: mongoose.Types.ObjectId | IPopulatedUser): user is IPopulatedUser {
    return !(user instanceof mongoose.Types.ObjectId);
}
