import { atomWithStorage } from "jotai/utils";

export const uidAtom = atomWithStorage<string | null>("uid", null, undefined, {
  getOnInit: true,
});
