import { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./App.css";
import confetti from "canvas-confetti";

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstClickedCard, setFirstClickedCard] = useState(null);

  const fetchDogImages = async () => {
    setLoading(true);
    try {
      const fetchDog = async () => {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        return data.message;
      };

      const images = await Promise.all(
        Array.from({ length: 6 }, () => fetchDog())
      );

      setCards(
        [...images, ...images].map((image, index) => ({
          id: index,
          dogImage: image,
          isEmptyCard: true,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch some or all images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogImages();
  }, []);

  function updateCard(id, isEmptyCard) {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, isEmptyCard: isEmptyCard } : card
    );
    setCards(updatedCards);
  }

  function getCard(id) {
    return cards.find((card) => card.id === id);
  }

  async function handleClick(id) {
    const card = getCard(id);
    if (!card.isEmptyCard) {
      return;
    }
    updateCard(id, false);
    if (firstClickedCard === null) {
      setFirstClickedCard(id);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const firstCardImage = getCard(firstClickedCard).dogImage;
      const secondCardImage = card.dogImage;
      setFirstClickedCard(null);
      if (firstCardImage !== secondCardImage) {
        updateCard(id, true);
        updateCard(firstClickedCard, true);
      }
    }
  }

  useEffect(() => {
    if (loading) {
      return;
    }

    const allFlipped = cards.every((card) => !card.isEmptyCard);
    if (allFlipped) {
      confetti();
    }
  }, [cards]);

  return (
    <div>
      <h1>Let's Play</h1>
      <h3>Click on the cards to find pairs:</h3>
      {loading && <p>Loading dogs...</p>}
      {!loading && (
        <div className="grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              dogImage={card.dogImage}
              onClickCard={handleClick}
              isEmptyCard={card.isEmptyCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
