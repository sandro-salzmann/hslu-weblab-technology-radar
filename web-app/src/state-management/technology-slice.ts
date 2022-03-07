import { StoreSlice } from "./store";

export type TechnologySlice = {
  activeTechnologyId?: string;
  setActiveTechnologyId: (id: string) => void;
  clearActiveTechnologyId: () => void;

  activePublishingTechnologyId?: string;
  setActivePublishingTechnologyId: (id: string) => void;
  clearActivePublishingTechnologyId: () => void;
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

  activePublishingTechnologyId: undefined,
  setActivePublishingTechnologyId: (id: string) =>
    set((state) => ({ activePublishingTechnologyId: id })),
  clearActivePublishingTechnologyId: () =>
    set((state) => ({ activePublishingTechnologyId: undefined })),
});
