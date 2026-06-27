import { USER_ROLE } from "@attendance/shared-types";
import { User } from "../../modules/users/user.model.js";
;

export const isStudent = (user: User) =>
    user.role === USER_ROLE.STUDENT;

export const isInstructor = (user: User) =>
    user.role === USER_ROLE.INSTRUCTOR;

export const isAdmin = (user: User) =>
    user.role === USER_ROLE.ADMIN;