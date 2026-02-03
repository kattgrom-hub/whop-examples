"use client";

import { useState } from "react";
import { picks, sports } from "@/lib/data";

export default function PicksPage() {
  const [selectedSport, setSelectedSport] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filteredPicks =
    selectedSport === "All"
      ? picks
      : picks.filter((p) => p.sport === selectedSport);

  const pendingPicks = filteredPicks.filter((p) => p.result === "pending");
  const settledPicks = filteredPicks.filter((p) => p.result !== "pending");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Picks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showForm ? "Cancel" : "New Pick"}
        </button>
      </div>

      {/* New Pick Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Post New Pick</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sport</label>
              <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500">
                {sports.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.emoji} {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">League</label>
              <input
                type="text"
                placeholder="e.g., NFL, NBA"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Matchup</label>
              <input
                type="text"
                placeholder="e.g., Chiefs vs Bills"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Pick Type</label>
              <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500">
                <option>Spread</option>
                <option>Moneyline</option>
                <option>Over/Under</option>
                <option>Player Prop</option>
                <option>Puck Line</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Pick</label>
              <input
                type="text"
                placeholder="e.g., Chiefs -3.5"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Odds</label>
              <input
                type="text"
                placeholder="e.g., -110"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Units (1-5)</label>
              <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Game Time</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Analysis</label>
              <textarea
                rows={4}
                placeholder="Explain your reasoning for this pick..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Post Pick
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedSport("All")}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedSport === "All"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All
        </button>
        {sports.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSport(s.name)}
            className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
              selectedSport === s.name
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span>{s.emoji}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Pending Picks */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Pending ({pendingPicks.length})</h2>
        {pendingPicks.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            No pending picks
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPicks.map((pick) => (
              <div
                key={pick.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                      {pick.sport === "NFL" && "🏈"}
                      {pick.sport === "NBA" && "🏀"}
                      {pick.sport === "MLB" && "⚾"}
                      {pick.sport === "NHL" && "🏒"}
                      {pick.sport === "Soccer" && "⚽"}
                      {pick.sport === "Tennis" && "🎾"}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{pick.matchup}</p>
                      <p className="text-gray-400">
                        {pick.pickType}: <span className="text-white">{pick.pick}</span> ({pick.odds})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Game Time</p>
                      <p className="font-medium">
                        {new Date(pick.gameTime).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Win
                      </button>
                      <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Loss
                      </button>
                      <button className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                        Push
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settled Picks */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Settled ({settledPicks.length})</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Matchup</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Pick</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Odds</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Units</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {settledPicks.map((pick) => (
                <tr key={pick.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {pick.sport === "NFL" && "🏈"}
                        {pick.sport === "NBA" && "🏀"}
                        {pick.sport === "MLB" && "⚾"}
                        {pick.sport === "NHL" && "🏒"}
                        {pick.sport === "Soccer" && "⚽"}
                        {pick.sport === "Tennis" && "🎾"}
                      </span>
                      <span>{pick.matchup}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{pick.pick}</td>
                  <td className="px-6 py-4 text-gray-400">{pick.odds}</td>
                  <td className="px-6 py-4">{pick.units}u</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pick.result === "win"
                          ? "bg-green-500/20 text-green-500"
                          : pick.result === "loss"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {pick.result?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
