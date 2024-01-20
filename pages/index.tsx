import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import Artist from "@/components/Artist";
import Library from "@/components/Library";
import Player from "@/components/Player";
import PlayListView from "@/components/PlayListView";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";

interface HomeProps {}

type ViewType = "search" | "library" | "playlist" | "artist";

export default function Home(props: HomeProps) {
  const [view, setView] = useState<ViewType | any>("search");
  const [globalPlaylistId, setGlobalPlaylistId] = useState<string | any>(null);
  const [globalArtistId, setGlobalArtistId] = useState<string | any>(null);
  const [globalCurrentSongId, setGlobalCurrentSongId] = useState<string | any>(null);
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState<boolean>(false);

  return (
    <>
      <main className="h-screen overflow-hidden bg-black">
        <div className="flex w-full">
          <Sidebar
            view={view}
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
          />
          {view === "playlist" && (
            <PlayListView
              setView={setView}
              setGlobalArtistId={setGlobalArtistId}
              globalPlaylistId={globalPlaylistId}
              setGlobalCurrentSongId={setGlobalCurrentSongId}
              setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            />
          )}
          {view === "search" && (
            <Search
              setView={setView}
              setGlobalPlaylistId={setGlobalPlaylistId}
              setGlobalCurrentSongId={setGlobalCurrentSongId}
              setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
              setGlobalArtistId={setGlobalArtistId}
            />
          )}
          {view === "library" && (
            <Library
              setView={setView}
              setGlobalPlaylistId={setGlobalPlaylistId}
            />
          )}
          {view === "artist" && (
            <Artist
              setView={setView}
              globalArtistId={globalArtistId}
              setGlobalArtistId={setGlobalArtistId}
              setGlobalCurrentSongId={setGlobalCurrentSongId}
              setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            />
          )}
        </div>
        <div className="sticky z-20 bottom-0 w-full">
          <Player
            globalCurrentSongId={globalCurrentSongId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            globalIsTrackPlaying={globalIsTrackPlaying}
           
          />
        </div>
      </main>
    </>
  );
}
