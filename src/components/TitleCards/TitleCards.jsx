import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const cardsRef = useRef(null);
  const [apiData, setApiData] = useState([]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  // Mouse wheel → horizontal scroll
  const handleWheel = (e) => {
    e.preventDefault();
    cardsRef.current.scrollLeft += e.deltaY;
  };

  // Drag start
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = cardsRef.current.scrollLeft;
  };

  // Drag move
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const walk = (e.pageX - startX.current) * 1.5;
    cardsRef.current.scrollLeft = scrollStart.current - walk;
  };

  // Drag end
  const stopDragging = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    fetch(`/api/movies?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
  console.log("MOVIES API DATA:", data);
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          {apiData.map(
            (card) =>
              card.backdrop_path && (
                <Link
                  to={`/player/${card.id}`}
                  className="card"
                  key={card.id}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                    alt={card.original_title}
                    draggable={false}
                  />
                  <p>{card.original_title}</p>
                </Link>
              )
          )}
        </div>

        <button className="arrow right" onClick={() => scrollByArrow(700)}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default TitleCards;
