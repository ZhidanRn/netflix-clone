'use client';

import { checkIfInWatchList } from "@/app/action";
import CommentSection from "@/app/components/CommentSection";
import ShareButton from "@/app/components/ShareButton";
import WatchListButton from "@/app/components/WatchListButton";
import { useEffect, useRef, useState } from "react";
import { 
    Backward, 
    Forward, 
    FullscreenEnter, 
    FullscreenExit, 
    PauseStandard, 
    PlaybackSpeed, 
    PlayStandard, 
    VolumeHighStandard, 
    VolumeLowStandard, 
    VolumeMediumStandard, 
    VolumeOffStandard 
} from "./IconControlVideoStream";

interface WatchClientProps {
    movieId: number;
    data: {
        title: string;
        overview: string;
        imageString: string;
        videoSource: string;
        videoSource360p?: string;
        videoSource480p?: string;
        videoSource720p?: string;
        videoSource1080p?: string;
        release: string;
        duration: string;
        id: number;
        age: string;
        youtubeString: string;
    };
    userId: string;
}

const speeds = [0.5, 0.75, 1, 1.25, 1.5];

const VideoStream: React.FC<WatchClientProps> = ({ movieId, data, userId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [hoverTime, setHoverTime] = useState(0);
    const [isHoveringTimebar, setIsHoveringTimebar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isInWatchList, setIsInWatchList] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isSpeedHovered, setIsSpeedHovered] = useState(false);
    const [isMouseMoving, setIsMouseMoving] = useState(true);
    let mouseTimeout: NodeJS.Timeout;
    let controlsTimeout: NodeJS.Timeout;
  
    useEffect(() => {
      const handleMouseMove = () => {
        setIsMouseMoving(true);
        setControlsVisible(true);
  
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          setIsMouseMoving(false);
        }, 2000);
  
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
          setControlsVisible(false);
        }, 3000); 
      };
  
      document.addEventListener("mousemove", handleMouseMove);
  
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(mouseTimeout);
        clearTimeout(controlsTimeout);
      };
    }, []);

    useEffect(() => {
        const lastTime = localStorage.getItem(`movie-${movieId}-time`);
        if (videoRef.current && lastTime) {
            videoRef.current.currentTime = parseFloat(lastTime);
        }
    }, [movieId]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((currentTime / duration) * 100);
            setCurrentTime(currentTime);
            setDuration(duration);
            localStorage.setItem(`movie-${movieId}-time`, currentTime.toString());
        }
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime += 10;
        }
    };

    const handleBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 10;
        }
    };

    const handleFullscreen = () => {
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
            if (videoContainerRef.current && videoContainerRef.current.requestFullscreen) {
                videoContainerRef.current.requestFullscreen();
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * duration;
            videoRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    useEffect(() => {
        const fetchWatchListStatus = async () => {
            const status = await checkIfInWatchList(movieId);
            setIsInWatchList(status);
        };
        fetchWatchListStatus();

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [movieId]);

    const formatTime = (time: number) => {
        const remainingTime = duration - time;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const previewVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, [videoRef.current]);

    const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (duration) {
            const time = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
            setHoverTime(time);
            if(previewVideoRef.current) {
                previewVideoRef.current.currentTime = time;
            }
        }
    }

    const leftPosition = (hoverTime / duration) * 100;
    const adjustedLeft = Math.min(
        Math.max(leftPosition, 9), 
        92 - (44 / window.innerWidth * 100) 
    );

    return (
        <div className="flex flex-col">
            <div 
                ref={videoContainerRef} 
                className={`relative w-full mx-auto p-4 ${ !isMouseMoving ? "cursor-none" : "cursor-default"}`}
            >
                <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg">
                    <video
                        ref={videoRef}
                        className="absolute top-0 left-0 w-full h-full"
                        poster={data.imageString}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onMouseMove={() => {
                            setControlsVisible(true)
                        }}
                    >
                        <source src={data.videoSource} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    {controlsVisible && (

                    <div className={`absolute sm:bottom-4 bottom-1 left-0 right-0 p-4 flex flex-col 
                        ${(controlsVisible || isFullscreen) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    >
                        <div className="flex items-center mx-2 sm:mb-5 mb-3 group">

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={handleSeek}
                                onMouseMove={handleHover}
                                onMouseEnter={() => setIsHoveringTimebar(true)}
                                onMouseLeave={() => setIsHoveringTimebar(false)}
                                className="w-full h-1 cursor-pointer appearance-none hover:h-2"
                                style={{ 
                                    background: `linear-gradient(to right, #ff4757 ${progress}%, #ddd ${progress}%)` 
                                }}
                            />

                            {isHoveringTimebar && (
                                <div
                                    className="absolute top-[60px] z-10 transition-opacity duration-200 ease-in-out transform -translate-x-1/2 -translate-y-44 overflow-visible"
                                    style={{
                                        left: `${adjustedLeft}%`,
                                    }}
                                >
                                    <video
                                        ref={previewVideoRef}
                                        className="w-44 h-auto min-w-44 min-h-max bg-black rounded shadow-lg sm:flex hidden outline-none outline-2 outline-red-500"
                                        src={data.videoSource}
                                        muted
                                    />
                                    <span className="text-white text-sm my-2 flex justify-center items-center">{formatTime(hoverTime)}</span>
                                    
                                </div>
                            )}

                            <span className="text-white text-sm ml-2">{formatTime(currentTime)}</span>
                        </div>

                        <div className="flex justify-center items-center gap-5 mx-2">
                            <div className="flex items-center sm:gap-8 gap-4">
                                <button onClick={togglePlayPause} className="text-white transform transition-transform duration-200 hover:scale-125">
                                    {isPlaying ? (
                                        <PauseStandard />
                                    ) : (
                                        <PlayStandard />
                                    )}
                                </button>
                                <button onClick={handleBackward} className="text-white transform transition-transform duration-200 hover:scale-125">
                                    <Backward />
                                </button>
                                <button onClick={handleForward} className="text-white transform transition-transform duration-200 hover:scale-125">
                                    <Forward />
                                </button>
                                <div 
                                    className="relative flex items-center group"
                                    onMouseEnter={() => setIsVolumeHovered(true)}
                                    onMouseLeave={() => setIsVolumeHovered(false)}
                                >
                                    <button onClick={toggleMute} className="text-white transform transition-transform duration-200 hover:scale-125">
                                        {isMuted || volume === 0 ? (
                                            <VolumeOffStandard />
                                        ) : volume > 0 && volume < 0.5 ? (
                                            <VolumeLowStandard />
                                        ) : volume >=0.5 && volume < 1 ? (
                                            <VolumeMediumStandard />
                                        ) : (
                                            <VolumeHighStandard />
                                        )}
                                    </button>
                                    {isVolumeHovered && (
                                        <div className="absolute flex items-center justify-center bg-gray-900 p-3 rounded-sm cursor-pointer appearance-none -rotate-90 sm:bottom-20 bottom-16 left-1/2 transform -translate-x-1/2 hover:group">
                                            <input 
                                                type="range"
                                                min="0" 
                                                max="1" 
                                                step="0.1"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="w-16 sm:w-24 h-2"
                                                style={{ 
                                                    background: `linear-gradient(to right, #ff4757 ${(volume) * 100}%, #ddd ${(volume) * 100}%)` 
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex mx-auto" >
                                <p className="sm:flex font-semibold hidden lg:mr-20 md:mr-14">{data.title}</p>
                            </div>
                            
                            <div className="flex items-center sm:gap-8 gap-4">

                                <div 
                                    className="relative flex items-center group"
                                    onMouseEnter={() => setIsSpeedHovered(true)}
                                    onMouseLeave={() => setIsSpeedHovered(false)}
                                >
                                    <button className="text-white transform transition-transform duration-200 hover:scale-125" title="Speed">
                                        <PlaybackSpeed />
                                    </button>

                                    {isSpeedHovered && (
                                    <div className="absolute bg-zinc-800 w-[200px] h-24 sm:w-[500px] sm:h-32 rounded-sm flex flex-col justify-center items-center -top-24 -left-5 sm:-top-36 sm:-left-40 transform -translate-x-1/2">
                                        <h1 className="absolute text-white sm:text-2xl text-md font-semibold left-5 top-2">Playback Speed</h1>
                                        <div className="relative w-full flex items-center mt-10 sm:16">
                                            <input 
                                                type="range"
                                                min="0" 
                                                max={speeds.length - 1}
                                                step="1"
                                                value={speeds.indexOf(playbackRate)}
                                                onChange={(e) => {
                                                    const selectedIndex = parseInt(e.target.value);
                                                    setPlaybackRate(speeds[selectedIndex]);
                                                    if (videoRef.current) {
                                                        videoRef.current.playbackRate = speeds[selectedIndex];
                                                    }
                                                }}
                                                className="w-full h-2 bg-transparent cursor-pointer appearance-none z-10 relative"
                                                style={{ opacity: 0, pointerEvents: 'none' }}
                                            />
                                            
                                            <div className="absolute sm:p-8 p-3 w-full flex justify-between items-center z-20 top-1/2 transform -translate-y-1/2">
                                                <div className="absolute sm:w-[400px] w-[150px] h-0.5 bg-gray-500 z-0 left-5 bottom-11 sm:left-12 sm:bottom-[72px]" />
                                                
                                                {speeds.map((speed, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="relative flex flex-col items-center z-30 cursor-pointer"
                                                        onClick={() => {
                                                            setPlaybackRate(speed);
                                                            if (videoRef.current) {
                                                                videoRef.current.playbackRate = speed;
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            className={`w-3 h-3 rounded-full transition-transform duration-200 ease-in-out ${
                                                                playbackRate === speed ? "bg-red-500 transform scale-150" : "bg-gray-200"
                                                            }`}
                                                        ></div>
                                                        <span className={`text-white sm:text-xl text-sm mt-2 ${playbackRate === speed ? "font-bold" : ""}`}>
                                                            {speed}x
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>
                                <button onClick={handleFullscreen} className="text-white transform transition-transform duration-200 hover:scale-125">
                                    {isFullscreen ? (
                                        <FullscreenExit />
                                    ) : (
                                        <FullscreenEnter />
                                    )}
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className="mx-4">
                <h1 className="text-xl font-bold">{data?.title}</h1>
                <ul className="flex gap-x-2 mt-4">
                    <li>{data?.release} | </li>
                    <li>{data?.age}+ | </li>
                    <li>{data?.duration}h </li>
                </ul>
                <p className="mt-4">{data?.overview}</p>

                <hr className="my-4" />

                <div className="flex gap-x-2">
                    <WatchListButton movieId={movieId} watchListId={data?.id.toString()} watchList={isInWatchList} />
                    <ShareButton title={data?.title} text={data?.overview} />
                </div>
                <CommentSection movieId={movieId} userId={userId} />
            </div>
        </div>
    );
};

export default VideoStream;
