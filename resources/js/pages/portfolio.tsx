"use client"

import { useState, useEffect, useRef } from "react"
import { Head, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { Portfolio, SharedData } from "@/types"
import PortfolioCard from "@/components/cards/PortfolioCard"

export default function Portfolio() {
    <Head title="Kreavoks | Portfolio" />
    const { auth } = usePage<SharedData>().props
    const { portfolios } = usePage<SharedData & { portfolios: Portfolio[] }>().props || { portfolios: [] }

    // State for filtering and pagination
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Categories for filtering - dinamis dari data
    const categories = ["all", ...new Set(portfolios.map((portfolio) => portfolio.category))]

    // Filter items based on search query and category
    const filteredItems = portfolios.filter(
        (portfolio) =>
            (selectedCategory === "all" || portfolio.category === selectedCategory) &&
            (portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                portfolio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                portfolio.client.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory])

    const [isPageLoaded, setIsPageLoaded] = useState(false)

    // Refs for scroll animations
    const heroRef = useRef<HTMLDivElement>(null)
    const mainContentRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    // Page load animation
    useEffect(() => {
        setIsPageLoaded(true)

        // Set up intersection observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in")
                    }
                })
            },
            { threshold: 0.1 },
        )

        // Observe elements
        const refs = [
            heroRef,
            mainContentRef,
            ctaRef,
        ]

        refs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current)
        })

        return () => {
            refs.forEach((ref) => {
                if (ref.current) observer.unobserve(ref.current)
            })
        }
    }, [])

    return (
        <AppLayout>
            <Head title="Portfolio - Kreavoks" />
            <div
                className={`flex min-h-screen flex-col bg-white text-black transition-opacity duration-500 ${isPageLoaded ? "opacity-100" : "opacity-0"}`}
            >
                {/* Hero Section */}
                <section ref={heroRef} className="relative py-16 bg-gradient-to-br from-blue-50 to-white overflow-hidden opacity-0">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute -right-20 top-20 w-40 h-40 rounded-full bg-blue-500/10 animate-wander-1"></div>
                        <div className="absolute left-1/4 bottom-10 w-24 h-24 rounded-full bg-yellow-300/20 animate-wander-2"></div>
                        <div className="absolute right-1/3 top-1/3 w-16 h-16 rounded-full border-4 border-blue-500/20 animate-wander-3"></div>

                        {/* Grid pattern */}
                        <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-10">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-full border-r border-blue-500/20"></div>
                            ))}
                        </div>
                    </div>

                    <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Portofolio <span className="text-blue-500">Karya Terbaik</span> Kami
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Lihat berbagai proyek yang telah kami kerjakan untuk klien dari berbagai industri. Setiap proyek
                                dirancang dengan perhatian terhadap detail dan fokus pada kebutuhan pengguna.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section ref={mainContentRef} className="container mx-auto px-6 md:px-12 lg:px-16 py-12 opacity-0">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        {/* Search */}
                        <div className="w-full md:w-auto order-2 md:order-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search portfolio..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-search text-gray-400"></i>
                                </div>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="w-full md:w-auto order-1 md:order-2 overflow-x-auto hide-scrollbar">
                            <div className="flex gap-2 min-w-max pb-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === category
                                            ? "bg-blue-500 text-white"
                                            : "cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {category === "all" ? "All Projects" : category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6 text-gray-600">Showing {filteredItems.length} projects</div>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedItems.length > 0 ? (
                            paginatedItems.map((portfolio) => (
                                <PortfolioCard
                                    key={portfolio.id}
                                    portfolio={portfolio}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <i className="fa-solid fa-chevron-left text-sm"></i>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === page ? "bg-blue-500 text-white" : "border border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <i className="fa-solid fa-chevron-right text-sm"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section ref={ctaRef} className="py-16 opacity-0">
                    <div className="container mx-auto px-6 md:px-12 lg:px-16">
                        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10"></div>
                            <div className="absolute left-1/4 top-0 w-20 h-20 rounded-full bg-yellow-300/20"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl font-bold text-blue-900 mb-4">Punya Proyek yang Ingin Dikerjakan?</h2>
                                    <p className="text-blue-800/70 mb-6">
                                        Kami siap membantu mewujudkan ide Anda menjadi solusi digital yang inovatif. Konsultasikan kebutuhan
                                        Anda dengan tim kami sekarang.
                                    </p>
                                    <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 cursor-pointer hover:scale-105 transition duration-300">
                                        Diskusikan Proyek Anda
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    )
}
