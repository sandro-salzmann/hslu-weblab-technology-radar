import { StoreSlice } from "./store";

export type TechnologySlice = {
  activeTechnologyId?: string;
  setActiveTechnologyId: (id: string) => void;
  clearActiveTechnologyId: () => void;
};

export const createTechnologySlice: StoreSlice<TechnologySlice> = (
  set,
  get
) => ({
  activeTechnologyId: undefined,
  setActiveTechnologyId: (id: string) =>
    set((state) => ({ activeTechnologyId: id })),
  clearActiveTechnologyId: () =>
    set((state) => ({ activeTechnologyId: undefined })),
});
