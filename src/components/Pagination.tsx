"use client"

import Link from "next/link"
import { useAtom } from "jotai"
import {
  currentPageAtom,
  totalPagesAtom,
  pageRangeAtom,
} from "@/atoms/pageAtom"

interface PaginationProps {
  initialPage: number
  initialTotalPages: number
}

export default function Pagination({
  initialPage,
  initialTotalPages,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  const [totalPages, setTotalPages] = useAtom(totalPagesAtom)
  const [range] = useAtom(pageRangeAtom)

  // 초기값 설정
  if (currentPage === 1 && initialPage !== 1) {
    setCurrentPage(initialPage)
  }
  if (totalPages === 1 && initialTotalPages !== 1) {
    setTotalPages(initialTotalPages)
  }

  // 페이지 범위 계산
  const startPage = Math.max(1, currentPage - range)
  const endPage = Math.min(totalPages, currentPage + range)

  // 표시할 페이지 번호 배열 생성
  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <Link
        href={`/?page=1`}
        className={`px-4 py-2 rounded ${
          currentPage <= 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: "&laquo;" }} />
      </Link>
      <Link
        href={`/?page=${Math.max(1, currentPage - 1)}`}
        className={`px-4 py-2 rounded ${
          currentPage <= 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: "&lsaquo;" }} />
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={`/?page=${page}`}
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={`/?page=${Math.min(totalPages, currentPage + 1)}`}
        className={`px-4 py-2 rounded ${
          currentPage >= totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: "&rsaquo;" }} />
      </Link>
      <Link
        href={`/?page=${totalPages}`}
        className={`px-4 py-2 rounded ${
          currentPage >= totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: "&raquo;" }} />
      </Link>
    </div>
  )
}
