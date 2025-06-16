"use client"

import { useState, useEffect } from "react"
import {
  Database,
  Zap,
  Sparkles,
  Bot,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Search,
  Loader2,
  AlertCircle,
  X,
  ExternalLink,
  Mail,
  Users,
} from "lucide-react"

export default function DatasetVisualizer() {
  const [datasetId, setDatasetId] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOriginalVideo, setSelectedOriginalVideo] = useState(0)
  const [selectedMultipliedVideo, setSelectedMultipliedVideo] = useState(0)
  const [datasets, setDatasets] = useState([])
  const [videoErrors, setVideoErrors] = useState(new Set())
  const [videoLoading, setVideoLoading] = useState(new Set())
  const [isMultiplying, setIsMultiplying] = useState(false)

  // Separate state variables for modal and server status
  const [showServerDownModal, setShowServerDownModal] = useState(true)
  const [serverDown, setServerDown] = useState(true)

  // Helper function to extract dataset ID from Hugging Face URL or return the input as-is
  const extractDatasetId = (input) => {
    const trimmedInput = input.trim()

    // Check if it's a Hugging Face URL
    const hfUrlPattern = /https?:\/\/huggingface\.co\/datasets\/(.+)/
    const match = trimmedInput.match(hfUrlPattern)

    if (match) {
      // Extract the dataset ID from the URL (everything after /datasets/)
      return match[1].replace(/\/$/, "") // Remove trailing slash if present
    }

    // If it's not a URL, return the input as-is (assuming it's already a dataset ID)
    return trimmedInput
  }

  const onPageLoadAPI = async () => {
    console.log("starting page load sequence")
    try {
      const res = await fetch("/api/onPageLoad")
      const data = await res.json()

      console.log(data)
      console.log(data[0].database_id)

      setDatasets(data)
      return data // Return the data so it can be used elsewhere
    } catch (error) {
      console.error("Failed to fetch datasets:", error)
      return [] // Return empty array on error
    }
  }

  useEffect(() => {
    onPageLoadAPI()
  }, [])

  const handleMultiply = async () => {
    // Check if servers are down first
    if (serverDown) {
      alert("Servers are currently down. Please check out our work from this weekend and sign up on our waitlist!")
      return
    }

    if (!datasetId.trim()) return alert("Please enter a dataset ID or Hugging Face URL")

    // Extract dataset ID from URL if needed
    const processedDatasetId = extractDatasetId(datasetId)

    // Check if dataset already exists
    const existingDataset = datasets.find(
      (dataset) => dataset.database_id.toLowerCase() === processedDatasetId.toLowerCase(),
    )

    if (existingDataset) {
      alert("This dataset already exists! Please enter a different dataset ID.")
      setDatasetId("")
      return
    }

    setIsMultiplying(true) // Start loading

    try {
      const res = await fetch("/api/scan-dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_id: processedDatasetId }),
      })

      if (!res.ok) throw new Error("Scan failed.")

      const { old_video_links, new_video_links } = await res.json()

      const dbRes = await fetch("/api/submitDataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          database_id: processedDatasetId,
          progress: "in_progress",
          old_video_links,
          new_video_links,
        }),
      })

      if (dbRes.ok) {
        // Refresh datasets and automatically select the new one
        const updatedDatasets = await onPageLoadAPI()
        const newDataset = updatedDatasets.find((dataset) => dataset.database_id === processedDatasetId)

        if (newDataset) {
          setSelectedDataset(newDataset)
          setSelectedOriginalVideo(0)
          setSelectedMultipliedVideo(0)
          setDatasetId("") // Clear the input field
        }
      } else {
        alert("Failed to submit dataset to database.")
      }
    } catch (err) {
      console.error("❌ handleMultiply error:", err)
      alert("Something went wrong. Check console.")
    } finally {
      setIsMultiplying(false) // End loading
    }
  }

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = dataset.database_id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDatasetId =
      datasetId.trim() === "" || dataset.database_id.toLowerCase().includes(datasetId.toLowerCase())
    return matchesSearch && matchesDatasetId
  })

  const handleOriginalVideoChange = (index) => {
    setSelectedOriginalVideo(index)
    setSelectedMultipliedVideo(index) // sync
  }

  const handleVideoError = (index) => {
    setVideoErrors((prev) => new Set(prev).add(index))
    setVideoLoading((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const handleVideoLoad = (index) => {
    setVideoLoading((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const handleMultipliedVideoChange = (index) => {
    setSelectedMultipliedVideo(index)
    setSelectedOriginalVideo(index)

    // Clear any previous error for this index
    setVideoErrors((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })

    // Mark as loading
    setVideoLoading((prev) => {
      const newSet = new Set(prev)
      newSet.add(index)
      return newSet
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Server Down Modal */}
      {showServerDownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowServerDownModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowServerDownModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white text-center mb-4">Servers Are Down</h2>

            {/* Message */}
            <p className="text-white/80 text-center leading-relaxed">
              Servers are down - check out our work from this weekend and sign up on waitlist{" "}
              <a
                href="https://example.com/waitlist" // Replace with actual waitlist URL
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 transition-colors"
              >
                here
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>

            {/* Optional: Action Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowServerDownModal(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        {/* Contact Us Button - Top Left */}
        <a
          href="mailto:contact@example.com" // Replace with actual contact email
          className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm">Contact Us</span>
        </a>

        {/* Instructions Dropdown - Top Right */}
        <div className="relative">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">How to use</span>
            {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showInstructions && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 text-white shadow-xl z-50">
              <h4 className="text-sm font-semibold mb-3 text-blue-300">How to Use the Dataset Multiplier</h4>
              <div className="space-y-3 text-xs">
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>
                    Paste your Hugging Face dataset ID (e.g. <code>siyavash/so101_test</code>) or full URL (e.g.{" "}
                    <code>https://huggingface.co/datasets/siyavash/so101_test</code>) into the input field.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>
                    Click <strong>Multiply</strong>. We'll find your videos and start augmenting them automatically.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>
                    Your dataset will appear below. 🟡 Yellow means it's still generating. 🟢 Green means it's done. 🔴
                    Red means there was an error.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Click any dataset to preview the original and generated videos side-by-side.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">5.</span>
                  <span>
                    Once complete, download the full dataset from:
                    <br />
                    <code>lerobot/augmented_[your_dataset_id]</code>
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-xs text-gray-300">
                  <span className="text-yellow-400">💡 Tip:</span> You can leave and come back later — progress is
                  saved.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="text-center max-w-7xl mx-auto">
          {/* Icon and Title */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              LeRobot Dataset Multiplier
            </h1>
          </div>

          {/* Subtitle with Icon and Waitlist Link */}
          <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <p className="text-lg md:text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold border-b-2 border-gradient-to-r from-blue-400 to-cyan-400 inline-block pb-1">
                Grow your datasets with the click of a button
              </p>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>

            {/* Waitlist Link */}
            <a
              href="https://forms.gle/axgXSdmVpZWcrADi9" // Replace with actual waitlist URL
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Join Our Waitlist</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Server Status Indicator */}
            {serverDown && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 backdrop-blur-md text-red-300 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Servers are currently down</span>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter dataset ID or Hugging Face URL"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                onClick={(e) => e.key === "Enter" && handleMultiply()}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-300 backdrop-blur-md focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                disabled={serverDown}
              />
            </div>
            {isMultiplying ? (
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 min-w-[120px] rounded-lg shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : (
              <button
                onClick={handleMultiply}
                disabled={serverDown}
                className={`flex items-center justify-center gap-2 px-8 py-3 min-w-[120px] rounded-lg shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${serverDown
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-xl hover:scale-105"
                  }`}
              >
                <Zap className="w-4 h-4" />
                Multiply
              </button>
            )}
          </div>

          {/* Main Content Area with Videos */}
          <div className="flex items-start justify-center gap-8 mb-8">
            {/* Left Video */}
            <div
              className={`transition-all duration-500 mt-16 ${selectedDataset ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
                }`}
            >
              {selectedDataset && (
                <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 w-[400px]">
                  <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-400" />
                    Original Dataset
                  </h4>

                  {/* Video Selection Dropdown */}
                  <div className="mb-3">
                    <select
                      value={selectedOriginalVideo}
                      onChange={(e) => handleOriginalVideoChange(Number.parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 py-2 backdrop-blur-md focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    >
                      {selectedDataset.old_video_links.map((url, index) => (
                        <option key={index} value={index} className="bg-gray-800 text-white">
                          episode_{index}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Video Player */}
                  <div className="relative rounded-lg overflow-hidden bg-black/20">
                    <video
                      key={selectedDataset.old_video_links[selectedOriginalVideo]} // force reload on change
                      src={selectedDataset.old_video_links[selectedOriginalVideo]}
                      title={`Original Dataset Episode ${selectedOriginalVideo}`}
                      className="w-full h-68"
                      controls
                      autoPlay
                      muted
                      loop
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </div>

            {/* Example Datasets - Center */}
            <div className="flex-shrink-0">
              {/* Header with Search */}
              <div className="flex items-center justify-between gap-4 mb-6 w-full">
                <h3 className="text-white text-lg flex items-center gap-2 flex-shrink-0">
                  <Database className="w-5 h-5 text-blue-400" />
                  Example Datasets:
                </h3>
                <div className="relative flex-shrink-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 w-48 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-gray-400 backdrop-blur-md focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="w-[32rem] mx-auto">
                <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-colors">
                  <div className="flex flex-col gap-3 px-4 py-2">
                    {filteredDatasets.length > 0 ? (
                      filteredDatasets.map((dataset, index) => {
                        const isSelected = selectedDataset?.id === dataset.id
                        const isComplete = dataset.progress.toLowerCase() === "complete"

                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedDataset(dataset)
                              setSelectedOriginalVideo(0)
                              setSelectedMultipliedVideo(0)
                              // Clear video error and loading states when switching datasets
                              setVideoErrors(new Set())
                              setVideoLoading(new Set())
                            }}
                            className={`bg-white/10 border backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group rounded-lg ${isSelected ? "border-blue-400 bg-white/20" : "border-white/20"
                              }`}
                          >
                            <div className="p-4 flex items-center gap-3">
                              {/* Left gradient status dot */}
                              <div
                                className={`w-3 h-3 rounded-full ${isComplete
                                  ? "bg-green-400"
                                  : dataset.progress.toLowerCase() === "error"
                                    ? "bg-red-400"
                                    : "bg-yellow-400"
                                  } shadow-md flex-shrink-0`}
                              />

                              {/* Dataset name */}
                              <div className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors truncate">
                                {dataset.database_id}
                              </div>

                              {/* Right hover dot */}
                              <div
                                className={`ml-auto w-2 h-2 rounded-full ${isComplete
                                  ? "bg-green-400"
                                  : dataset.progress.toLowerCase() === "error"
                                    ? "bg-red-400"
                                    : "bg-yellow-400"
                                  } opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No datasets found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Video */}
            <div
              className={`transition-all duration-500 mt-16 ${selectedDataset ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
                }`}
            >
              {selectedDataset && (
                <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 w-[400px]">
                  <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    Multiplied Result
                  </h4>

                  {/* Video Selection Dropdown */}
                  <div className="mb-3">
                    <select
                      value={selectedMultipliedVideo}
                      onChange={(e) => handleMultipliedVideoChange(Number.parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 py-2 backdrop-blur-md focus:bg-white/20 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all duration-300"
                    >
                      {selectedDataset.new_video_links.map((url, index) => (
                        <option key={index} value={index} className="bg-gray-800 text-white">
                          episode_{index} {videoErrors.has(index) ? " (Generating...)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Video Player */}
                  <div className="relative rounded-lg overflow-hidden bg-black/20 h-68 flex items-center justify-center">
                    {videoErrors.has(selectedMultipliedVideo) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                          <AlertCircle className="w-5 h-5 text-orange-400" />
                        </div>
                        <h5 className="text-lg font-semibold mb-2 text-center">Currently Generating Your Data</h5>
                        <p className="text-sm text-white/60 text-center leading-relaxed">
                          This episode is being processed. Please check back in a few minutes.
                        </p>
                        <div className="mt-4 w-full bg-white/10 rounded-full h-1">
                          <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-1 rounded-full animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {videoLoading.has(selectedMultipliedVideo) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                          </div>
                        )}
                        <video
                          key={selectedDataset.new_video_links[selectedMultipliedVideo]}
                          src={selectedDataset.new_video_links[selectedMultipliedVideo]}
                          title={`Multiplied Dataset Episode ${selectedMultipliedVideo}`}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          muted
                          loop
                          preload="metadata"
                          onError={() => handleVideoError(selectedMultipliedVideo)}
                          onLoadedData={() => handleVideoLoad(selectedMultipliedVideo)}
                          onLoadStart={() =>
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev)
                              newSet.add(selectedMultipliedVideo)
                              return newSet
                            })
                          }
                        >
                          Your browser does not support the video tag.
                        </video>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
