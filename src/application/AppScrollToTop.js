import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const AppScrollToTop = () => {

  // Récupération du pathname
  const { pathname } = useLocation();

  // Scroll automatique vers le haut, à chaque changement de pathname
  useEffect(() => {
    const pageContent = document.getElementById('pageContent');
    pageContent.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
  }, [pathname]);

}
