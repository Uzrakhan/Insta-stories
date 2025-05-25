import {useState, useEffect} from 'react';
import storiesData from '../data/stories.json'


const Stories = () => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true)

    //auto-advance stories
    useEffect(() => {
        let timer;
        if (isViewerOpen && progress < 100 & !isLoading) {
            timer = setTimeout(() => {
                setProgress(prev => Math.min(prev + 1, 100))
            }, 50)
        }else if (progress >= 100) {
            handleNext();
        }
        return () => clearTimeout(timer)
    }, [progress, isViewerOpen, isLoading]);


    const openStory = (index) => {
        setIsLoading(true)
        setCurrentStoryIndex(index)
        setIsViewerOpen(true)
        setProgress(0)
    }

    const handleNext = () => {
        if (currentStoryIndex < storiesData.length - 1) {
            setIsLoading(true)
            setProgress(0)
            setCurrentStoryIndex(prev => prev + 1);
        }else {
            setIsViewerOpen(false)
        }
    }

    const handlePrev = () => {
        if (currentStoryIndex === 0) {
            setIsViewerOpen(false)
        } else {
            setIsLoading(true);
            setProgress(0);
            setCurrentStoryIndex(prev => prev - 1);
        }
    }

    const handleImgLoad = () => {
        setIsLoading(false);
        setProgress(0)
    }
    return (
        <div className='max-w-md mx-auto relative h-screen bg-black'>
            {/*stories list */}
            <div className='p-4 overflow-x-auto flex space-y-4'>
                {storiesData.map((story,index) => (
                    <button
                    key={story.id}
                    onClick={() => openStory(index)}
                    className='flex-shrink-0 w-16 h-16 rounded-full 
                    border-2 border-purple-500 p-0.5 relative'
                    >
                        <img 
                         src={story.userAvatar}
                         alt={story.username}
                         className='w-full h-full rounded-full object-cover'
                        />
                        {story.viewed && (
                            <div className="absolute inset-0 bg-black/50 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/*Story viewer */}
            {isViewerOpen && (
                <div className='fixed inset-0 bg-black'>
                    {/*Progress bar */}
                    <div className='absolute top-4 left-0 right-0 flex space-x-1 p-4 z-10'>
                        {storiesData.map((_,index) => (
                            <div
                            key={index}
                            className='h-1 bg-gray-600 flex-1 rounded-full'
                            >
                                <div className={`h-full bg-white rounded-full transition-all 
                                    duration-50 
                                    ${index === currentStoryIndex ? 'w-full' : 
                                        index < currentStoryIndex ? 'w-full' : 'w-0'
                                    }
                                    `}
                                    style={{width: index === currentStoryIndex ? `${progress}%` : '' }}
                                    />
                            </div>
                        ))}
                    </div>

                    {/*Loading state */}
                    {isLoading && (
                        <div className='absolute inset-0 flex items-center justify-center z-30'>
                            <div className='w-12 h-12 border-4 border-white/30 rounded-full 
                                animate-spin border-t-transparent'/>
                        </div>
                    )}

                    {/*story content */}
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
                    <img 
                     src={storiesData[currentStoryIndex].storyImage}
                     alt='story'
                     className={`aboslute inset-0 w-full h-full object-contain z-0 
                        ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300
                        `}
                     onLoad={handleImgLoad}
                     onError={() => setIsLoading(false)}
                    />
                </div>
            )}
        </div>
    )
}

export default Stories;