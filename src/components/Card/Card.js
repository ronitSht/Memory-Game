import "./Card.css";

export default function Card(props) {
  return (
    <div className="card-wrapper" onClick={() => props.onClickCard(props.id)}>
      {props.isEmptyCard ? (
        <div className="card-placeholder"></div>
      ) : (
        <img
          className="card-image"
          key={props.id}
          src={props.dogImage}
          alt={`Dog ${props.id}`}
        />
      )}
    </div>
  );
}
