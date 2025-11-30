import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./cards.css";
type features = {
  icon: IconDefinition;
  title: string;
  description: string;
};

interface CardProps {
  Card: features;
}
function Cardsitem({ Card }: CardProps) {
  return (
    <div className="card">
      <FontAwesomeIcon icon={Card.icon} />
      <h3>{Card.title}</h3>
      <p>{Card.description}</p>
    </div>
  );
}

export default Cardsitem;
