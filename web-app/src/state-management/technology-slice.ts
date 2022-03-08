import { StoreSlice } from "./store";

export type TechnologySlice = {
  activeTechnologyId?: string;
  setActiveTechnologyId: (id: string) => void;
  clearActiveTechnologyId: () => void;

  activePublishingTechnologyId?: string;
  setActivePublishingTechnologyId: (id: string) => void;
  clearActivePublishingTechnologyId: () => void;

  activeEditingTechnologyId?: string;
  setActiveEditingTechnologyId: (id: string) => void;
  clearActiveEditingTechnologyId: () => void;
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

  activeEditingTechnologyId: undefined,
  setActiveEditingTechnologyId: (id: string) =>
    set((state) => ({ activeEditingTechnologyId: id })),
  clearActiveEditingTechnologyId: () =>
    set((state) => ({ activeEditingTechnologyId: undefined })),
});
