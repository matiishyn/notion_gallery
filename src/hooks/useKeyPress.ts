import { useEffect, useState } from 'react';

function useKeyPress(targetKey: string): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    function downHandler(event: KeyboardEvent): void {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    }
    
    // If released key is our target key then set to false
    const upHandler = (event: KeyboardEvent): void => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);
  
  return keyPressed;
}

export default useKeyPress;