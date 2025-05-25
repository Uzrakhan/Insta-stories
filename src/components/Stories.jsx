import { useState, useEffect } from 'react';
import storiesData from '../data/stories.json';

const Stories = () => {
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(0);

    // Swipe detection
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const delta = touchStart - touchEnd;

        if (Math.abs(delta) > 50) {
            delta > 0 ? handleNext() : handlePrev();
        }
    };

    // Auto-advance stories
    useEffect(() => {
        let timer;
        if (isViewerOpen && progress < 100 && !isLoading) {
            timer = setTimeout(() => {
                setProgress(prev => Math.min(prev + 1, 100));
            }, 50);
        } else if (progress >= 100) {
            handleNext();
        }
        return () => clearTimeout(timer);
    }, [progress, isViewerOpen, isLoading]);

    const openUserStories = (userIndex) => {
        setCurrentUserIndex(userIndex);
        setCurrentStoryIndex(0);
        setIsViewerOpen(true);
        setProgress(0);
        setIsLoading(true);
    };

    const handleNext = () => {
        const currentUser = storiesData[currentUserIndex];
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            if (currentUserIndex < storiesData.length - 1) {
                setCurrentUserIndex(prev => prev + 1);
                setCurrentStoryIndex(0);
            } else {
                setIsViewerOpen(false);
            }
        }
        setProgress(0);
        setIsLoading(true);
    };

    const handlePrev = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else {
            if (currentUserIndex > 0) {
                //calculate new user index first
                const newUserIndex = currentUserIndex - 1;
                setCurrentUserIndex(newUserIndex)
                //use the new user index to get last story index
                setCurrentStoryIndex(storiesData[newUserIndex].stories.length - 1);
            } else {
                setIsViewerOpen(false);
            }
        }
        setProgress(0);
        setIsLoading(true);
    };

    const handleImgLoad = () => {
        setIsLoading(false);
        setProgress(0);
    };

    const currentUser = storiesData[currentUserIndex];
    const currentStory = currentUser?.stories[currentStoryIndex];

    return (
        <div className='max-w-md mx-auto relative h-screen bg-black'>
            {/* Stories list */}
            <div className='p-4 overflow-x-auto flex space-x-4 no-scrollbar'>
                {storiesData.map((user, index) => (
                    <div key={user.id} className="flex flex-col items-center flex-shrink-0 space-y-2">
                        <button
                            onClick={() => openUserStories(index)}
                            className='relative w-20 h-20 rounded-full border-2 border-purple-500 p-1 hover:border-purple-300 transition-all'
                        >
                            <img 
                                src={user.avatar}
                                alt={user.username}
                                className='w-full h-full rounded-full object-cover'
                            />
                            {(user.stories || []).some(s => !s.viewed) && (
                                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-black" />
                            )}
                        </button>
                        <span className="text-white text-xs max-w-20 truncate">
                            {user.username}
                        </span>
                    </div>
                ))}
            </div>

            {/* Story viewer */}
            {isViewerOpen && currentStory && (
                <div className='fixed inset-0 bg-black'
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Progress bar */}
                    <div className='absolute top-4 left-0 right-0 flex space-x-1 px-4 z-10'>
                        {currentUser.stories.map((_, index) => (
                            <div
                                key={index}
                                className='h-1 bg-gray-600 flex-1 rounded-full'
                            >
                                <div 
                                    className={`h-full bg-white rounded-full transition-all duration-50 
                                        ${index === currentStoryIndex ? 'w-full' : 
                                        index < currentStoryIndex ? 'w-full' : 'w-0'}`}
                                    style={{ width: index === currentStoryIndex ? `${progress}%` : '' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Caption Overlay */}
                    {currentStory.caption && (
                        <div className="absolute bottom-20 left-0 right-0 px-4 text-center z-30">
                            <p className="text-white text-xl font-medium bg-black/50 rounded-lg p-2 inline-block">
                                {currentStory.caption}
                            </p>
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading && (
                        <div className='absolute inset-0 flex items-center justify-center z-30'>
                            <div className='w-12 h-12 border-4 border-white/30 rounded-full 
                                animate-spin border-t-transparent'/>
                        </div>
                    )}

                    {/* Navigation controls */}
                    <div className='absolute inset-0 flex z-20'>
                        <button 
                            onClick={handlePrev}
                            className='w-1/2 h-full active:bg-gray-800/20 cursor-default'
                            aria-label="Previous story"
                        />
                        <button 
                            onClick={handleNext}
                            className='w-1/2 h-full active:bg-gray-800/20 cursor-default'
                            aria-label="Next story"
                        />
                    </div>

                    {/* Story content */}
                    {currentStory.type === 'video' ? (
                        <video
                            autoPlay
                            muted
                            className={`absolute inset-0 w-full h-full object-contain z-0 
                                ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                            onLoadedData={handleImgLoad}
                            onEnded={handleNext}
                        >
                            <source src={currentStory.media} type="video/mp4" />
                        </video>
                    ) : (
                        <img 
                            src={currentStory.media}
                            alt='story'
                            className={`absolute inset-0 w-full h-full object-contain z-0 
                                ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                            onLoad={handleImgLoad}
                            onError={() => setIsLoading(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Stories;