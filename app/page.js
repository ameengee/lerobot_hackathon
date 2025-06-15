"use client"

import { useState } from "react"
import { Database, Zap, Sparkles, Bot, HelpCircle, ChevronDown, ChevronUp, Play, Search } from "lucide-react"

export default function DatasetVisualizer() {
  const [datasetId, setDatasetId] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOriginalVideo, setSelectedOriginalVideo] = useState(0)
  const [selectedMultipliedVideo, setSelectedMultipliedVideo] = useState(0)

  const handleMultiply = () => {
    if (datasetId.trim()) {
      console.log("Multiplying dataset:", datasetId)
      // Add your multiply logic here
      alert(`Processing dataset: ${datasetId}`)
    } else {
      alert("Please enter a dataset ID")
    }
  }

  const handleExampleClick = (example, dataset) => {
    // setDatasetId(example)
    setSelectedDataset(dataset)
    // Reset video selections when a new dataset is selected
    setSelectedOriginalVideo(0)
    setSelectedMultipliedVideo(0)
  }

  // Handle original video change and sync with multiplied video
  const handleOriginalVideoChange = (index) => {
    setSelectedOriginalVideo(index)
    setSelectedMultipliedVideo(index) // Sync by index
  }

  // Handle multiplied video change and sync with original video
  const handleMultipliedVideoChange = (index) => {
    setSelectedMultipliedVideo(index)
    setSelectedOriginalVideo(index) // Sync by index
  }

  // Video options for original dataset
  const originalVideoOptions = [
    {
      title: "Robot Manipulation Demo",
      url: "https://huggingface.co/datasets/siyavash/so101_test/resolve/main/videos/chunk-000/observation.images.wrist/episode_000000.mp4",
    },
    {
      title: "Advanced Robotics Training",
      url: "https://www.youtube.com/embed/7inJVh_n7_U?autoplay=1&loop=1&playlist=7inJVh_n7_U&mute=1",
    },
    {
      title: "AI Learning Process",
      url: "https://www.youtube.com/embed/HpFNLFLtiBw?autoplay=1&loop=1&playlist=HpFNLFLtiBw&mute=1",
    },
  ]

  // Video options for multiplied results
  const multipliedVideoOptions = [
    {
      title: "Enhanced Performance",
      url: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      title: "Improved Accuracy",
      url: "https://www.youtube.com/embed/7inJVh_n7_U?autoplay=1&loop=1&playlist=7inJVh_n7_U&mute=1",
    },
    {
      title: "Optimized Results",
      url: "https://www.youtube.com/embed/HpFNLFLtiBw?autoplay=1&loop=1&playlist=HpFNLFLtiBw&mute=1",
    },
  ]

  const exampleDatasets = [
    {
      name: "lerobot/aloha_static_cups_open",
      color: "from-purple-500 to-pink-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/columbia_cairlab_pusht_real",
      color: "from-blue-500 to-cyan-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/taco_play",
      color: "from-green-500 to-emerald-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/berkeley_autolab_ur5",
      color: "from-red-500 to-orange-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/stanford_hydra_dataset_converted_externally_to_rlds",
      color: "from-indigo-500 to-purple-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/austin_buds_dataset_converted_externally_to_rlds",
      color: "from-teal-500 to-green-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/nyu_franka_play_dataset_converted_externally_to_rlds",
      color: "from-pink-500 to-rose-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/maniskill_dataset_converted_externally_to_rlds",
      color: "from-yellow-500 to-amber-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/furniture_bench_dataset_converted_externally_to_rlds",
      color: "from-violet-500 to-fuchsia-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/ucsd_kitchen_dataset_converted_externally_to_rlds",
      color: "from-lime-500 to-green-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/austin_sailor_dataset_converted_externally_to_rlds",
      color: "from-sky-500 to-blue-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
    {
      name: "lerobot/austin_sirius_dataset_converted_externally_to_rlds",
      color: "from-emerald-500 to-teal-500",
      leftVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
      rightVideo: "https://www.youtube.com/embed/9Uch931cDx8?autoplay=1&loop=1&playlist=9Uch931cDx8&mute=1",
    },
  ]

  // Filter datasets based on search query
  const filteredDatasets = exampleDatasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Instructions Dropdown - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">How to use</span>
            {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Instructions Panel */}
          {showInstructions && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 text-white shadow-xl">
              <h4 className="text-sm font-semibold mb-3 text-blue-300">How to Use the Dataset Multiplier</h4>
              <div className="space-y-3 text-xs">
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>
                    Enter a dataset ID in the input field, or click on any example dataset below to auto-fill it.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Click the "Multiply" button to process and expand your dataset.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>
                    Browse the example datasets to see what's available - each one can be multiplied to create larger
                    training sets.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Use "Explore Open Datasets" to discover more robotics datasets from the community.</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-xs text-gray-300">
                  <span className="text-yellow-400">💡 Tip:</span> Dataset multiplication helps create larger, more
                  diverse training sets for better robot learning.
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

          {/* Subtitle with Icon */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <p className="text-lg md:text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold border-b-2 border-gradient-to-r from-blue-400 to-cyan-400 inline-block pb-1">
              Grow your datasets with the click of a button
            </p>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>

          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter dataset id (e.g. lerobot)"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleMultiply()}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-300 backdrop-blur-md focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              />
            </div>
            <button
              onClick={handleMultiply}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 min-w-[120px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              <Zap className="w-4 h-4" />
              Multiply
            </button>
          </div>

          {/* Main Content Area with Videos */}
          <div className="flex items-start justify-center gap-8 mb-8">
            {/* Left Video */}
            <div
              className={`transition-all duration-500 mt-16 ${selectedDataset ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"}`}
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
                      {originalVideoOptions.map((option, index) => (
                        <option key={index} value={index} className="bg-gray-800 text-white">
                          {option.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative rounded-lg overflow-hidden bg-black/20">
                    <video
                      src={originalVideoOptions[selectedOriginalVideo].url}
                      title="Original Dataset Demo"
                      className="w-full h-68"
                      controls
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
                      filteredDatasets.map((dataset, index) => (
                        <div
                          key={index}
                          onClick={() => handleExampleClick(dataset.name, dataset)}
                          className={`bg-white/10 border backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group rounded-lg ${selectedDataset?.name === dataset.name ? "border-blue-400 bg-white/20" : "border-white/20"
                            }`}
                        >
                          <div className="p-4 flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full bg-gradient-to-r ${dataset.color} shadow-lg flex-shrink-0`}
                            />
                            <div className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors truncate">
                              {dataset.name}
                            </div>
                            <div
                              className={`ml-auto w-2 h-2 rounded-full bg-gradient-to-r ${dataset.color} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}
                            />
                          </div>
                        </div>
                      ))
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
              className={`transition-all duration-500 mt-16 ${selectedDataset ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"}`}
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
                      {multipliedVideoOptions.map((option, index) => (
                        <option key={index} value={index} className="bg-gray-800 text-white">
                          {option.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative rounded-lg overflow-hidden bg-black/20 w-full">
                    <iframe
                      src={multipliedVideoOptions[selectedMultipliedVideo].url}
                      title="Multiplied Dataset Result"
                      className="w-full h-68"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
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
