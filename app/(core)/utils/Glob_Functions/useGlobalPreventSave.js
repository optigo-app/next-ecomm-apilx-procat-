import { useEffect } from 'react';

const useGlobalPreventSave = () => {
    useEffect(() => {
        let ctrlAWasPressed = false;
        let aKeyTimeout;

        // Prevent default drag behavior for images and videos
        const disableDrag = () => {
            const imgs = document.querySelectorAll('img');
            const videos = document.querySelectorAll('video');
            imgs.forEach((img) => {
                img.setAttribute('draggable', 'false');
            });
            videos.forEach((video) => {
                video.setAttribute('draggable', 'false');
            });
        };

        const handleKeyDown = (e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;

            // Prevent Ctrl+S (Save)
            if (isCtrlOrCmd && e.key.toLowerCase() === 's') {
                e.preventDefault();
            }

            // Track Ctrl+A press
            if (isCtrlOrCmd && e.key.toLowerCase() === 'a') {
                ctrlAWasPressed = true;
                document.body.classList.add('block-image-copy');
                clearTimeout(aKeyTimeout);
                aKeyTimeout = setTimeout(() => {
                    ctrlAWasPressed = false;
                    document.body.classList.remove('block-image-copy');
                }, 600000); // 10 minutes
            }
        };

        // Prevent copying images/videos to clipboard
        const handleCopy = (e) => {
            if (ctrlAWasPressed) {
                const selection = window.getSelection();
                const selectedNodes = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneContents() : null;
                if (selectedNodes) {
                    const imgs = selectedNodes.querySelectorAll('img');
                    const videos = selectedNodes.querySelectorAll('video');
                    if (imgs.length > 0 || videos.length > 0) {
                        e.preventDefault(); // Block clipboard copy
                        // Optionally, set plain text to clipboard to avoid media
                        const textContent = selection.toString();
                        e.clipboardData.setData('text/plain', textContent);
                        e.clipboardData.setData('text/html', ''); // Empty HTML to prevent media
                    }
                }
            }
        };

        // Prevent dragging when Ctrl+A is active and images/videos are selected
        const handleDragStart = (e) => {
            if (ctrlAWasPressed) {
                const selection = window.getSelection();
                const selectedNodes = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneContents() : null;
                if (selectedNodes) {
                    const imgs = selectedNodes.querySelectorAll('img');
                    const videos = selectedNodes.querySelectorAll('video');
                    if (imgs.length > 0 || videos.length > 0) {
                        e.preventDefault(); // Block drag if images or videos are selected
                        return;
                    }
                }
            }
            // Fallback: Prevent drag for individual image/video elements
            if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
                e.preventDefault(); // Prevent drag entirely
            }
        };

        // Initialize drag prevention
        disableDrag();

        // Observe DOM changes to ensure new images/videos are not draggable
        const observer = new MutationObserver(() => {
            disableDrag();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Add event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('copy', handleCopy);
        window.addEventListener('dragstart', handleDragStart, true);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('copy', handleCopy);
            window.removeEventListener('dragstart', handleDragStart, true);
            observer.disconnect();
            clearTimeout(aKeyTimeout);
        };
    }, []);
};

export default useGlobalPreventSave;