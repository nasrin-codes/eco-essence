import React, { useState } from 'react';
import './RecipesPage.css'

const recipesData = [
  {
    id: 1,
    title: "Creamy Cashew Alfredo",
    time: "25 mins",
    difficulty: "Easy",
    tag: "Quick Dinner",
    desc: "A rich, velvety pasta alternative made entirely from raw cashews, nutritional yeast, and garlic.",
    ingredients: ["Gluten-free pasta", "Raw cashews", "Garlic", "Nutritional yeast"],
    icon: "🍝",
    steps: [
      "Soak raw cashews in boiling hot water for 15 minutes to soften.",
      "Boil your favourite gluten-free pasta according to package instructions.",
      "Blend soaked cashews, minced garlic, nutritional yeast, salt, and 1 cup of pasta water until completely smooth.",
      "Toss the creamy blended sauce over the hot pasta and garnish with fresh parsley."
    ]
  },
  {
    id: 2,
    title: "High-Protein Lentil Bowl",
    time: "30 mins",
    difficulty: "Medium",
    tag: "High Protein",
    desc: "Hearty green lentils mixed with roasted sweet potatoes, fresh avocado slices, and tahini drizzle.",
    ingredients: ["Green lentils", "Sweet potato", "Avocado", "Tahini dressing"],
    icon: "🥣",
    steps: [
      "Rinse and boil green lentils in seasoned vegetable broth for 20 minutes.",
      "Dice sweet potatoes, toss in olive oil and salt, and roast at 200°C for 25 minutes.",
      "Assemble your bowl starting with a base of lentils, topped with roasted sweet potatoes and sliced avocado.",
      "Whisk tahini with lemon juice and warm water, then drizzle generously over the bowl."
    ]
  },
  {
    id: 3,
    title: "Green Goddess Smoothie Bowl",
    time: "10 mins",
    difficulty: "Easy",
    tag: "Breakfast",
    desc: "An antioxidant-packed meal blending baby spinach, ripe bananas, hemp seeds, and organic almond milk.",
    ingredients: ["Spinach", "Banana", "Almond milk", "Hemp seeds"],
    icon: "🥬",
    steps: [
      "Place fresh baby spinach, frozen banana chunks, and almond milk into a high-speed blender.",
      "Blend on high until the texture is thick, creamy, and vibrant green.",
      "Pour into a serving bowl carefully.",
      "Top beautifully with organic hemp seeds, chia seeds, and fresh berries."
    ]
  },
  {
    id: 4,
    title: "Crispy Tofu Tacos",
    time: "25 mins",
    difficulty: "Medium",
    tag: "Quick Dinner",
    desc: "Pan-seared organic tofu seasoned with smoky cumin, wrapped in warm corn tortillas with zesty cabbage slaw.",
    ingredients: ["Firm tofu", "Corn tortillas", "Cabbage slaw", "Lime"],
    icon: "🌮",
    steps: [
      "Press firm tofu to remove water, dice into cubes, and coat with cumin, garlic powder, and cornstarch.",
      "Pan-fry tofu cubes in a skillet with a dash of oil until all sides are golden and crispy.",
      "Warm up your corn tortillas slightly over an open flame or clean skillet.",
      "Fill tortillas with crispy tofu, top with crunchy cabbage slaw, and squeeze fresh lime juice over them."
    ]
  },
   {
    id: 5,
    title: "Zesty Avocado Cucumber Tartare",
    time: "15 mins",
    difficulty: "Easy",
    tag: "Salads & Sides",
    desc: "A refreshing, stacked green appetizer balancing creamy hass avocado with crispy english cucumber, dill, and capers.",
    ingredients: ["Avocado", "Cucumber", "Fresh dill", "Capers", "Lemon juice"],
    icon: "🥑",
    steps: [
      "Finely cube the English cucumber and Hass avocado into equal, tiny pieces.",
      "In a small mixing bowl, whisk together the fresh lemon juice, olive oil, minced dill, and drained capers.",
      "Gently fold the chopped avocado and cucumber into the dressing mixture without mashing.",
      "Pack the mixture firmly into an oiled ramekin or food mold ring, then invert onto your serving plate."
    ]
  },
  {
    id: 6,
    title: "Emerald Kale & Pumpkin Seed Pesto",
    time: "12 mins",
    difficulty: "Easy",
    tag: "Quick Dinner",
    desc: "A robust, deep-green nutrient powerhouse sauce made with destemmed baby kale leaves and roasted pepitas.",
    ingredients: ["Baby kale", "Roasted pumpkin seeds", "Garlic", "Olive oil", "Lemon"],
    icon: "🌿",
    steps: [
      "Add the raw baby kale leaves, garlic cloves, and roasted pumpkin seeds into your food processor.",
      "Pulse several times until the mixture is coarsely and uniformly chopped.",
      "With the motor running low, slowly drizzle in the extra virgin olive oil to create an emulsion.",
      "Season with fresh lemon juice, sea salt, and black pepper to balance the iron flavor profile."
    ]
  },
  {
    id: 7,
    title: "Super-Green Broccoli Detox Soup",
    time: "25 mins",
    difficulty: "Medium",
    tag: "High Protein",
    desc: "Warm, velvety bowl of gently simmered broccoli florets, sweet peas, and fresh celery stalks blended with coconut cream.",
    ingredients: ["Broccoli", "Green peas", "Celery", "Onion", "Coconut milk"],
    icon: "🥦",
    steps: [
      "Sauté diced onions and chopped celery stalks in a large stockpot until soft and translucent.",
      "Add broccoli florets and pour in clean vegetable stock until everything is just covered; bring to a boil.",
      "Reduce heat to medium-low, drop in the green peas, and simmer gently for 8 minutes.",
      "Transfer carefully to a blender, pour in a splash of coconut milk, and process into a silky emerald soup."
    ]
  }
];

export default function RecipesPage() {
  const [recipeSearch, setRecipeSearch] = useState('');
  const [activeRecipeTag, setActiveRecipeTag] = useState('All');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const toggleRecipeSteps = (id) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const filteredRecipes = recipesData.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
                          recipe.ingredients.some(i => i.toLowerCase().includes(recipeSearch.toLowerCase()));
    const matchesTag = activeRecipeTag === 'All' || recipe.tag === activeRecipeTag;
    return matchesSearch && matchesTag;
  });

  return (
    <main className="recipes-page">
      <div className="page-header">
        <h2>The Greeny Kitchen</h2>
        <p>Simple, flavorful recipes crafted cleanly from whole plant ingredients.</p>
      </div>

      <div className="search-filter-bar">
        <input 
          type="text" 
          placeholder="Search recipe titles or ingredients..." 
          className="search-input"
          value={recipeSearch}
          onChange={(e) => setRecipeSearch(e.target.value)}
        />
        <div className="tag-filters">
          {['All', 'Quick Dinner', 'High Protein', 'Breakfast'].map((tag) => (
            <button 
              key={tag} 
              className={`tag-btn ${activeRecipeTag === tag ? 'active' : ''}`} 
              onClick={() => setActiveRecipeTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-banner">
              <span style={{ fontSize: '4.5rem' }}>{recipe.icon}</span>
              <div className="recipe-meta-badges">
                <span className="meta-badge">⏱️ {recipe.time}</span>
                <span className="meta-badge">👨‍🍳 {recipe.difficulty}</span>
              </div>
            </div>
            <div className="recipe-content">
              <span className="product-tag" style={{ background: '#fff3e0', color: '#e65100' }}>{recipe.tag}</span>
              <h3>{recipe.title}</h3>
              <p className="recipe-desc">{recipe.desc}</p>
              
              <div className="recipe-details-short">
                <h4>Key Ingredients</h4>
                <div className="ingredients-inline-list">
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient-chip">{ing}</span>
                  ))}
                </div>
              </div>

              
              {expandedRecipeId === recipe.id && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f4f9f5', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--primary)' }}>Preparation Steps:</h4>
                  <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--dark)' }}>
                    {recipe.steps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '0.4rem' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <button 
                className="view-recipe-btn" 
                onClick={() => toggleRecipeSteps(recipe.id)}
                style={{ marginTop: '1.5rem', background: expandedRecipeId === recipe.id ? 'var(--primary)' : 'var(--primary-light)', color: expandedRecipeId === recipe.id ? '#fff' : 'var(--primary)' }}
              >
                {expandedRecipeId === recipe.id ? "▲ Hide Instructions" : "📖 View Full Cooking Steps"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
