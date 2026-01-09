import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const cardsRef = useRef(null);
  const [apiData, setApiData] = useState([]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

 
    //  Pointer (Mouse + Touch)
  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = cardsRef.current.scrollLeft;
    cardsRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const walk = e.clientX - startX.current;
    cardsRef.current.scrollLeft = scrollStart.current - walk;
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    try {
      cardsRef.current.releasePointerCapture(e.pointerId);
    } catch {}
  };

  
    //  Mouse Wheel → Horizontal
 
  const handleWheel = (e) => {
    e.preventDefault();
    cardsRef.current.scrollLeft += e.deltaY;
  };


    //  Fetch Movies
  
  useEffect(() => {
    if (!category) return;

    fetch(`/api/movies?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setApiData(data.results || []);
      })
      .catch((err) => console.error(err));

    const slider = cardsRef.current;
    if (!slider) return;

    slider.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      slider.removeEventListener('wheel', handleWheel);
    };
  }, [category]);

// Arrow scroll
  const scrollByArrow = (value) => {
    cardsRef.current.scrollBy({
      left: value,
      behavior: 'smooth',
    });
  };

  return (
    <div className="titlecards">
      <h2>{title || 'Popular on Netflix'}</h2>

      <div className="cards-container">
        <button className="arrow left" onClick={() => scrollByArrow(-700)}>
          &#10094;
        </button>

        <div
          className="card-list"
          ref={cardsRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {apiData.map((card) => (
            <Link
              to={`/player/${card.id}`}
              className="card"
              key={card.id}
              draggable={false}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${card.poster_path || card.backdrop_path}`}
                alt={card.title || card.original_title || card.name}
                draggable={false}
              />
              <p>{card.title || card.original_title || card.name}</p>
            </Link>
          ))}
        </div>

        <button className="arrow right" onClick={() => scrollByArrow(700)}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default TitleCards;
