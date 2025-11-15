"use client";

import { useState } from "react";
import Link from "next/link";
import leaguesData from "@/data/leagues.json";

interface League {
  name: string;
  color: string;
  teams: string[];
}

interface LeaguesData {
  leagues: Record<string, League>;
}

export default function TeamsPage() {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  const { leagues } = leaguesData as LeaguesData;

  const handleLeagueSelect = (league: string) => {
    setSelectedLeague(league);
  };

  const handleBackToLeagues = () => {
    setSelectedLeague(null);
  };

  // League Selection View
  if (!selectedLeague) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your League
            </h1>
            <p className="text-xl text-gray-600">
              Select a league to view and manage teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Object.entries(leagues).map(([leagueKey, league]) => (
              <div
                key={leagueKey}
                onClick={() => handleLeagueSelect(leagueKey)}
                className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden">
                  <div
                    className={`h-32 bg-gradient-to-br ${league.color} relative`}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {league.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">
                          Teams Available
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {league.teams?.length || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Teams View for Selected League
  const selectedLeagueData = leagues[selectedLeague] || null;
  const leagueTeams = selectedLeagueData?.teams || [];
  const leagueInfo = selectedLeagueData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToLeagues}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow group"
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {leagueInfo?.name}
              </h1>
              <p className="text-xl text-gray-600">
                {leagueTeams.length} teams available
              </p>
            </div>
          </div>
          <Link
            href="/teams/create"
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition font-medium shadow-lg"
          >
            + Create Team
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leagueTeams.map((teamName: string, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
            >
              <div
                className={`h-4 bg-gradient-to-r ${leagueInfo?.color}`}
              ></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition mb-2 leading-tight">
                      {teamName}
                    </h3>
                    <p className="text-gray-600 text-sm">{leagueInfo?.name}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Status:</span>
                    <span className="text-sm font-medium text-green-600">
                      Available
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">League:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedLeague}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition font-medium text-sm">
                  View Team Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {leagueTeams.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No teams available
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no teams available for {leagueInfo?.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
