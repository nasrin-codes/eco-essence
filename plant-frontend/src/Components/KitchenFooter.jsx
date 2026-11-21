import React, { useState, useEffect } from 'react';
import matcha from '../assets/matcha.jpg'
import avogandu from '../assets/avogandu.jpg'
import pesto from '../assets/pesto.jpg'
import salad from '../assets/salad.jpg'
import cucumber from '../assets/cucumber.jpg'
import '../Components/KitchenFooter.css'
// Integrated Recipe Data Store Array
const recipeData = [
  {
    id: "crispy-matcha-waffles",
    title: "Crispy Matcha Waffles",
    category: "Breakfast",
    time: "20 min",
    servings: "2 people",
    difficulty: "Easy",
    image: matcha,
    summary: "Earthy, antioxidant-rich green tea waffles balanced beautifully with pure organic maple syrup.",
    ingredients: [
      "1.5 cups organic oat flour",
      "2 tbsp culinary matcha powder",
      "1 tbsp baking powder",
      "1 cup unsweetened almond milk",
      "2 tbsp pure maple syrup"
    ],
    instructions: [
      "Preheat your home waffle iron to medium-high heat.",
      "Whisk oat flour, matcha powder, and baking powder in a bowl.",
      "Pour in almond milk and maple syrup, then stir to form a bright green batter.",
      "Ladle onto the heated iron grid and bake until steam ceases."
    ]
  },
  {
    id: "creamy-avocado-gazpacho",
    title: "Creamy Avocado Gazpacho",
    category: "Lunch & Dinner",
    time: "10 min",
    servings: "4 people",
    difficulty: "Easy",
    image: avogandu,
    summary: "A velvety, cold garden soup blended raw with ripe avocados, cucumbers, and fresh zesty herbs.",
    ingredients: [
      "2 large ripe avocados, pitted",
      "1 English cucumber, roughly chopped",
      "1 clove garlic",
      "Juice of 1 fresh lime",
      "1/4 cup extra virgin olive oil"
    ],
    instructions: [
      "Place all raw ingredients cleanly into your high-speed blender.",
      "Pour in half a cup of ice-cold filtered water.",
      "Blend thoroughly on high speed until glassy and completely emulsion smooth.",
      "Season with sea salt, chill in the fridge, and serve cool."
    ]
  },
  {
    id: "zucchini-pesto-pasta",
    title: "Raw Zucchini Pesto Noodles",
    category: "Lunch & Dinner",
    time: "25 min",
    servings: "2 people",
    difficulty: "Medium",
    image:pesto ,
    summary: "Vibrant spiralized raw zucchini strands tossed beautifully in a thick walnut basil leaf pesto sauce.",
    ingredients: [
      "3 medium zucchini, spiralized",
      "2 cups fresh sweet basil leaves",
      "1/3 cup toasted walnuts",
      "2 cloves garlic",
      "1/3 cup cold pressed olive oil"
    ],
    instructions: [
      "Process fresh basil, garlic, and toasted walnuts together in a processor blade.",
      "Slowly drizzle in organic olive oil until smooth cream layers emerge.",
      "Pass raw zucchini through a spiralizer device to yield clean noodle nests.",
      "Toss raw zucchini strands with your fresh pesto paste gently until coated completely."
    ]
  },
  {
    id: "green-goddess-power-bowl",
    title: "Green Goddess Power Bowl",
    category: "Lunch & Dinner",
    time: "30 min",
    servings: "2 people",
    difficulty: "Medium",
    image: salad,
    summary: "A clean, high-protein bowl featuring warm quinoa, organic massaged kale, edamame, and a creamy tahini sauce.",
    ingredients: [
      "1 cup uncooked organic quinoa",
      "2 cups chopped curly kale leaves",
      "1 cup shelled steamed edamame",
      "1/4 cup hulled sesame tahini",
      "1 tbsp organic apple cider vinegar"
    ],
    instructions: [
      "Rinse and boil quinoa in two cups of water until fluffy and fully popped open.",
      "Massage kale with a drop of olive oil until tender, soft, and dark jade green.",
      "Assemble warm quinoa, edamame beans, and soft kale across two deep bowls.",
      "Whisk tahini and apple cider vinegar with warm water, then drizzle over the bowls."
    ]
  },
  {
    id: "cucumber-mint-cooler",
    title: "Cucumber Mint Elixir",
    category: "Drinks",
    time: "5 min",
    servings: "3 people",
    difficulty: "Easy",
    image: cucumber,
    summary: "An incredibly hydrating and alkalizing summer beverage crafted from crisp cucumbers, cold mint, and lime.",
    ingredients: [
      "2 crisp English cucumbers, peeled",
      "1 cup loose fresh mint leaves",
      "Juice of 2 large juicy limes",
      "2 tbsp clean liquid agave nectar",
      "3 cups crushed ice nuggets"
    ],
    instructions: [
      "Roughly slice your cucumbers and drop them into a blender pitcher.",
      "Add loose mint leaves, fresh lime juice, agave nectar, and filtered water.",
      "Run your machine on maximum speed for one full minute until uniform.",
      "Strain through a fine mesh sieve into ice-filled glassware and serve with extra mint."
    ]
  },
];

// Reusable Shared Botanical Inner Footer Component
function InnerFooter() {
  return (
    <footer className="kitchen-footer">
      <p className="footer-title">🌿 Plant-Based Cooking by Eco-Essence</p>
      <p className="footer-copyright">© {new Date().getFullYear()} Eco-Essence. Nurturing health across tabs.</p>
    </footer>
  );
}

// Sub-Component A: Complete Interactive Dashboard Catalog Grid
function KitchenHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('kitchen_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id, e) => {
    e.preventDefault(); 
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('kitchen_favorites', JSON.stringify(updated));
  };

  const filteredRecipes = recipeData.filter(dish => {
    const matchesSearch = dish.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dish.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || dish.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="home-wrapper">
      <header className="hero-banner">
        <h1>Clean Cooking for a Living Planet</h1>
        <p>Explore raw, plant-powered meals that optimize your vitality and health daily.</p>
        
        <div className="filter-controls-row">
          <input 
            type="text" 
            placeholder="Search raw ingredients or recipe names..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-field"
          />
          {/* <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="difficulty-select-field"
          >
            <option value="All">All Hardness Degrees</option>
            <option value="Easy">Easy Level</option>
            <option value="Medium">Medium Level</option>
          </select> */}
        </div>
      </header>

      <div className="showcase-grid">
        {filteredRecipes.map((dish) => (
          <article key={dish.id} className="dish-card">
            <div className="dish-img-frame">
              <img src={dish.image} alt={dish.title} />
              <span className="dish-tag">{dish.category}</span>
              <button 
                onClick={(e) => toggleFavorite(dish.id, e)}
                className="bookmark-fav-btn"
                title={favorites.includes(dish.id) ? "Remove from Vault" : "Bookmark Recipe"}
              >
                {favorites.includes(dish.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <div className="dish-details">
              <h2>{dish.title}</h2>
              <p>{dish.summary}</p>
              <div className="dish-meta">
                <span>⏳ {dish.time}</span>
                <span>🍽️ {dish.servings}</span>
                <span className="difficulty-badge-text">📊 {dish.difficulty}</span>
              </div>
              <a 
                href={`#/recipe/${dish.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="action-link"
              >
                View Full Recipe ↗
              </a>
            </div>
          </article>
        ))}
      </div>
      {filteredRecipes.length === 0 && (
        <p className="empty-results-text">No matching green plates found in current selection parameters.</p>
      )}
      <InnerFooter />
    </div>
  );
}

// Sub-Component B: Standalone Opened Window Details Component
function RecipeDetail({ recipeId }) {
  const currentDish = recipeData.find((item) => item.id === recipeId);

  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    const saved = localStorage.getItem(`checked_${recipeId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleCheckboxToggle = (index) => {
    const nextState = checkedIngredients.includes(index)
      ? checkedIngredients.filter(i => i !== index)
      : [...checkedIngredients, index];
    setCheckedIngredients(nextState);
    localStorage.setItem(`checked_${recipeId}`, JSON.stringify(nextState));
  };

  if (!currentDish) {
    return (
      <div className="missing-state">
        <h2>Recipe Missing</h2>
        <p>This path variant does not exist in our green kitchen catalog.</p>
        <a href="#/">Return Home</a>
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <div className="recipe-hero-strip">
        <img src={currentDish.image} alt={currentDish.title} />
        <div className="recipe-hero-overlay">
          <div className="detail-overlay-content-wrapper">
            <div className="title-block-group">
              <span className="pill-badge">{currentDish.category}</span>
              <h1>{currentDish.title}</h1>
              <div className="stats-row">
                <span>⏱️ Cook Time: {currentDish.time}</span>
                <span>🥣 Servings: {currentDish.servings}</span>
                <span>📊 Track: {currentDish.difficulty}</span>
              </div>
            </div>
            {/* <button onClick={() => window.print()} className="print-layout-btn">
              🖨️ Print Sheet
            </button> */}
          </div>
        </div>
      </div>

      <div className="recipe-columns">
        <section className="ingredients-column">
          <h3>The Ingredients</h3>
          <ul className="shopping-checklist">
            {currentDish.ingredients.map((item, i) => (
              <li key={i}>
                <input 
                  type="checkbox" 
                  id={`ing-${i}`} 
                  checked={checkedIngredients.includes(i)}
                  onChange={() => handleCheckboxToggle(i)}
                />
                <label 
                  htmlFor={`ing-${i}`} 
                  className={checkedIngredients.includes(i) ? "item-checked" : ""}
                >
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="directions-column">
          <h3>Preparation Method</h3>
          <ol className="step-timeline">
            {currentDish.instructions.map((step, i) => (
              <li key={i}>
                <div className="step-counter">{i + 1}</div>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <InnerFooter />
    </div>
  );
}

// 5. Main Unified Router Export Named Exactly To Match Your Target File
export default function KitchenFooter() {
  const [route, setRoute] = useState({ page: 'home', id: null });

  useEffect(() => {
    const syncRoute = () => {
        const currentHash = window.location.hash;if (currentHash.startsWith('#/recipe/')) {const extractedId = currentHash.replace('#/recipe/', '');setRoute({ page: 'recipe', id: extractedId });} else {setRoute({ page: 'home', id: null });}};window.addEventListener('hashchange', syncRoute);syncRoute();return () => window.removeEventListener('hashchange', syncRoute);}, []);
        return (
    <div className="kitchen-app">
      {/* <nav className="header-nav">
        <a href="#/" className="brand-logo">
          🌿 Greeny <span>Kitchen</span>
        </a>
      </nav> */}
      <main>
        {route.page === 'recipe' ? (
          <RecipeDetail recipeId={route.id} />
        ) : (
          <KitchenHome />
        )}
      </main>
    </div>
  );
}