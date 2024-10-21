/* eslint-disable react/prop-types */
import "./../styles/genre.css";

const GenreCard = ({ content, colors, textColor }) => {
  const styles = {
    genre: {
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      color: textColor,
    },
  };

  return (
    <div className="genre" style={styles.genre}>
      {content}
    </div>
  );
};

export default GenreCard;
