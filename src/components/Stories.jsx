import {useState, useEffect} from 'react';
import storiesData from '../data/stories.json'


const Stories = () => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [viewedStories, setViewedStories] = useState([]);


    //auto-advance stories
    useEffect(() => {
        let timer;
        if (isViewerOpen && progress < 100) {
            timer = setTimeout(() => {
                setProgress(prev => Math.min(prev + 1, 100))
            }, 50)
        }else if (progress >= 100) {
            handleNext();
        }
        return () => clearTimeout(timer)
    }, [progress, isViewerOpen]);


    const openStory = (index) => {
        setCurrentStoryIndex(index)
        setIsViewerOpen(true)
        setViewedStories(prev => [...prev, storiesData[index].id])
    }

    const handleNext = () => {
        setProgress(0)
        if (currentStoryIndex < storiesData.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setViewedStories(prev => [...prev, storiesData[currentStoryIndex + 1].id])
        }else {
            setIsViewerOpen(false)
        }
    }

    const handlePrev = () => {
        setProgress(0);
        setCurrentStoryIndex(prev => Math.min(prev - 1, 0))
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
                    border-2 border-purple-500 p-0.5'
                    >
                        <img 
                         src={story.image}
                         alt={story.user}
                         className='w-full h-full rounded-full object-cover'
                        />
                    </button>
                ))}
            </div>

            {/*Story viewer */}
            {isViewerOpen && (
                <div className='fixed inset-0 bg-black'>
                    {/*Progress bar */}
                    <div className='absolute top-4 left-0 right-0 flex space-x-1 p-4'>
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


                    {/*story content */}
                    <div className='flex h-full'>
                        <button 
                         onClick={handlePrev}
                         className='w-1/2 h-full active:bg-gray-800/20'
                        />
                        <button 
                        onClick={handleNext}
                        className='w-1/2 h-full active:bg-gray-800/20'
                        />
                    </div>
                    <img 
                     src={storiesData[currentStoryIndex].image}
                     alt='story'
                     className="absolute inset-0 w-full h-full object-contain"
                    />
                </div>
            )}
        </div>
    )
}

export default Stories;