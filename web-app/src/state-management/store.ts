import create, { GetState, SetState } from "zustand";
import { AuthSlice, createAuthSlice } from "./auth-slice";
import { createTechnologySlice, TechnologySlice } from "./technology-slice";

export type StoreState = AuthSlice & TechnologySlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

export const useStore = create<StoreState>((set, get) => ({
  ...createAuthSlice(set, get),
  ...createTechnologySlice(set, get),
}));
