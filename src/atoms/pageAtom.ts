import { atom } from "jotai"

// 현재 페이지 번호를 관리하는 atom
export const currentPageAtom = atom<number>(1)

// 전체 페이지 수를 관리하는 atom
export const totalPagesAtom = atom<number>(1)

// 페이지 범위를 관리하는 atom
export const pageRangeAtom = atom<number>(2)
