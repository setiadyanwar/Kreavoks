"use client"

import { useState, useEffect } from "react"
import { CheckIcon, XIcon } from "lucide-react"
import type { ServicePackage } from "@/types"

type Props = {
  paket: ServicePackage
}

const getDiscountedPrice = (price: number, discount: number): string => {
  const discounted = price - (price * discount) / 100
  return `Rp${discounted.toLocaleString("id-ID")}`
}

export default function ServicePackageCard({ paket }: Props) {
  const isHighlight = paket.highlight
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative rounded-2xl w-full h-full p-5 flex flex-col transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${isHovered ? "md:scale-105" : "scale-100"} ${
        isHighlight
          ? `${isVisible ? "md:-translate-y-3" : ""} shadow-[0_0_5px_3px_rgba(251,191,36,0.6)] bg-gradient-to-r from-blue-500 to-blue-400 text-white`
          : "bg-white text-black shadow-xl"
      }`}
      style={{ transitionDelay: "calc(var(--delay, 0) * 100ms)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHighlight && (
        <span className="absolute -top-3 text-xs bg-amber-100 text-amber-400 font-semibold px-2 py-1 rounded-full self-center mb-2 ring-1 ring-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse">
          PALING LARIS!
        </span>
      )}
      <h3 className="text-lg font-bold text-center">{paket.title}</h3>
      <h3 className={`text-center ${isHighlight ? "text-white" : "text-gray-400"}`}>{paket.description}</h3>
      <div className={`w-full h-[1px] my-0.5 ${isHighlight ? "bg-white/30" : "bg-gray-300"}`} />
      <p className="text-center font-bold text-2xl my-2">{getDiscountedPrice(paket.price, paket.discount)}</p>
      <div className="inline-flex items-center justify-center gap-2">
        <p className={`text-center text-sm line-through ${isHighlight ? "text-white" : "text-gray-500"}`}>
          Rp{paket.price.toLocaleString("id-ID")}
        </p>
        <p
          className={`text-center text-xs font-semibold px-2 py-0.5 rounded-full ${
            isHighlight ? "bg-white text-blue-500" : "bg-blue-50 text-blue-500"
          }`}
        >
          Diskon {paket.discount}%
        </p>
      </div>
      <button
        className={`mt-4 rounded-full py-2 text-sm font-semibold cursor-pointer transition-all duration-300 ${
          isHovered ? "shadow-lg" : ""
        } ${isHighlight ? "bg-white hover:bg-blue-50 text-blue-500" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
      >
        Pilih Paket
      </button>
      <ul className="space-y-2 mt-4">
        {paket.features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            {feature.status ? (
              <div className="w-4 h-4 flex items-center justify-center bg-green-500 text-white rounded-full">
                <CheckIcon size={12} />
              </div>
            ) : (
              <div className="w-4 h-4 flex items-center justify-center bg-red-300 text-white rounded-full">
                <XIcon size={12} />
              </div>
            )}
            <span
              className={`${
                feature.status
                  ? isHighlight
                    ? "text-white"
                    : "text-gray-800"
                  : isHighlight
                    ? "text-white/50"
                    : "text-gray-400"
              }`}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
