import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/trailer?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setApiData(data.results[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={() => navigate(-1)}
        className="back-arrow"
      />

      {apiData ? (
        <>
          <iframe
            width="90%"
            height="90%"
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
          ></iframe>

          <div className="player-info">
            <p>{apiData.published_at?.slice(0, 10)}</p>
            <p>{apiData.name}</p>
            <p>{apiData.type}</p>
          </div>
        </>
      ) : (
        <p className="loading">Loading trailer...</p>
      )}
    </div>
  );
};

export default Player;
