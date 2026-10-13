import { validateProfile, type CustomerProfile } from "../domain/profile";

export function saveProfile(profile: CustomerProfile) {
  return validateProfile(profile);
}
