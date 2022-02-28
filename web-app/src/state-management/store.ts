import create, { GetState, SetState } from "zustand";
import { createTechnologySlice, TechnologySlice } from "./technology-slice";

export type StoreState = TechnologySlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

export const useStore = create<StoreState>((set, get) => ({
  ...createTechnologySlice(set, get),
}));
