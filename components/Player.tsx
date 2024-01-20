import React, { useEffect, useState } from "react";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface PlayerProps {
  globalCurrentSongId: string | null;
  setGlobalCurrentSongId: React.Dispatch<React.SetStateAction<string | null>>;
  globalIsTrackPlaying: boolean;
  setGlobalIsTrackPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  
}

interface SongInfo {
  album: {
    images: Array<{
      url: string;
    }>;
  };
  name: string;
  artists: Array<{
    name: string;
  }>;
}


const Player: React.FC<PlayerProps> = ({
  globalCurrentSongId,
  setGlobalCurrentSongId,
  globalIsTrackPlaying,
  setGlobalIsTrackPlaying,
}) => {

  const { data: session }: { data: Session | any } = useSession();
  const [songInfo, setSongInfo] = useState<SongInfo | any>(null);

  async function fetchSongInfo(trackId: string) {
    if (trackId) {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data: SongInfo = await response.json();
      setSongInfo(data);
    }
  }

  async function getCurrentlyPlaying() {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (response.status === 204) {
      console.log("204 response from currently playing");
      return null;
    }
    const data = await response.json();
    return data;
  }

  async function handlePlayPause() {
    if (session && session.accessToken) {
      const data = await getCurrentlyPlaying();
      if (data?.is_playing) {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/pause",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.status === 204) {
          setGlobalIsTrackPlaying(false);
        }
      } else {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/play",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.status === 204) {
          setGlobalIsTrackPlaying(true);
          setGlobalCurrentSongId(data?.item?.id);
        
        }
      }
    }
  }

   async function handleNextSong() {
     if (session && session.accessToken) {
       const data = await getCurrentlyPlaying();
         const response = await fetch(
           "https://api.spotify.com/v1/me/player/next",
           {
             method: "POST",
             headers: {
               Authorization: `Bearer ${session.accessToken}`,  
             },
           }
         );
               
     }
   }

    async function handlePreviousSong() {
      if (session && session.accessToken) {
        const data = await getCurrentlyPlaying();
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/previous",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        
      }
    }

  useEffect(() => {
    // fetch song details and play song
    async function f() {
      if (session && session.accessToken) {
        if (!globalCurrentSongId) {
          // get the currently playing song from spotify
          const data = await getCurrentlyPlaying();
          setGlobalCurrentSongId(data?.item?.id);
          await fetchSongInfo(data?.item?.id);
          if (data?.is_playing) {
            setGlobalIsTrackPlaying(true);
          }
        
        } else {
          // get song info
          await fetchSongInfo(globalCurrentSongId);
        }
      }
    }
    f();
  }, [globalCurrentSongId]);

  useEffect(() => {
    async function fun() {
      const data = await getCurrentlyPlaying();
      await fetchSongInfo(data?.item?.id);
    }

    fun();
  }, [songInfo, globalCurrentSongId]);

  return (
    <div className="h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        {songInfo?.album.images[0].url && (
          <img
            className="hidden md:inline h-10 w-10"
            src={songInfo.album.images[0].url}
            alt="album cover"
          />
        )}
        <div>
          <p className="text-white text-sm">{songInfo?.name}</p>
          <p className="text-neutral-400 text-xs">
            {songInfo?.artists[0]?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-10 cursor-pointer">
          <div onClick={handlePreviousSong}>previous</div>
        {globalIsTrackPlaying ? (
          <PauseCircleIcon onClick={handlePlayPause} className="h-10 w-10" />
        ) : (
          <PlayCircleIcon onClick={handlePlayPause} className="h-10 w-10" />
        )}
      
        <div onClick={handleNextSong}>Next</div>
      </div>
       
    </div>
  );  
};

export default Player;
