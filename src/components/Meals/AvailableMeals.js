import { useState, useEffect, useCallback } from "react";

import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [httpError, setHttpError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMealsHandler = useCallback(async () => {
    setHttpError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://react-http-6d93a-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const mealsData = await response.json();

      const mealsOptions = [];

      for (const key in mealsData) {
        mealsOptions.push({
          id: key,
          name: mealsData[key].name,
          description: mealsData[key].description,
          price: mealsData[key].price,
        });

        setMeals(mealsOptions);
      }
    } catch (error) {
      setHttpError(error.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMealsHandler();
  }, [fetchMealsHandler]);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let content = <p>No Meals Available.</p>;

  if (meals.length > 0) {
    content = mealsList;
  }

  if (httpError) {
    content = <p>{httpError}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{content}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
