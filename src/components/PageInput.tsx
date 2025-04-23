"use client"

import { useRouter } from "next/navigation"
import { useState, KeyboardEvent } from "react"

interface PageInputProps {
  totalPages: number
}

export default function PageInput({ totalPages }: PageInputProps) {
  const router = useRouter()
  const [page, setPage] = useState("")

  const handleSubmit = () => {
    const pageNum = parseInt(page)
    if (pageNum && pageNum > 0 && pageNum <= totalPages) {
      router.push(`/?page=${pageNum}`)
    }
    setPage("")
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={page}
        onChange={(e) => setPage(e.target.value)}
        onKeyPress={handleKeyPress}
        min={1}
        max={totalPages}
        placeholder="페이지"
        className="w-20 px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        이동
      </button>
    </div>
  )
}
