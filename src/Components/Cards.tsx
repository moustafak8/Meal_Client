import {
  faCarrot,
  faUtensils,
  faCalendar,
  faBasketShopping,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import Cardsitem from "./Cardsitem";

export const Cards = () => {
  return (
    <div className="cards-section">
      <h2>
        Next Generation <span>Meal Planning</span>
      </h2>
      <p>
        Discover powerful features designed to transform your cooking experience
        and make meal planning effortless.
      </p>
      <div className="cards-container">
      <Cardsitem
        Card={{
          icon: faUtensils,
          title: "Foodie Assistant",
          description:
            "Get personalised recipes tailored to your preferences, cooking advice, or ask for complete meal plans for the week.",
        }}
      />
      <Cardsitem
        Card={{
          icon: faCarrot,
          title: "Pantry Management",
          description:
            "Track ingredients you already have to avoid duplicate purchases and discover new recipe ideas using what's in your kitchen.",
        }}
      />
      <Cardsitem
        Card={{
          icon: faCalendar,
          title: "Meal Planner",
          description:
            "Plan your meals effortlessly with our intuitive meal planning tool.",
        }}
      />
      <Cardsitem
        Card={{
          icon: faBasketShopping,
          title: "Smart Shopping Lists",
          description: "Buy only what you need and eliminate food waste.",
        }}
      />
      <Cardsitem
        Card={{
          icon: faBook,
          title: "Recipe Management",
          description:
            "Organise your recipes into customised recipe books for easy access and meal planning.",
        }}
      />
      </div>
    </div>
  );
};
