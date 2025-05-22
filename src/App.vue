<script>
import { ref, watch, onMounted } from 'vue'
import { useFetch, useFetchSearch } from './utils/useFetch.js'
import { minutesToHours } from './utils/utils.js'
export default {
  setup() {
    const API_BASE_URL = 'https://dummyjson.com'
    const searchQuery = ref('')
    const debouncedSearchQuery = ref('')
    const recipesList = ref([])
    const error = ref(null)
    const loading = ref(false)
    const selectedRecipe = ref(null)

    onMounted(async () => {
      await fetchData()
    })

    const fetchData = async () => {
      try {
        loading.value = true
        const response = await useFetch(`${API_BASE_URL}/recipes`)
        recipesList.value = response.recipes
      } catch (err) {
        error.value = err
      } finally {
        loading.value = false
      }
    }

    const fetchedSearchedData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await useFetchSearch(
          `${API_BASE_URL}/recipes/search?q=${searchQuery.value}`,
        )
        recipesList.value = response.recipes
      } catch (err) {
        error.value = err
      } finally {
        loading.value = false
      }
    }

    function displayRecipe(recipeID) {
      selectedRecipe.value = recipesList.value.filter((recipe) => recipe.id == recipeID)[0]
    }

    let timeoutId
    function handleTextChange() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        debouncedSearchQuery.value = searchQuery.value
      }, 500)
    }

    watch(debouncedSearchQuery, async (newDebouncedSearchQuery) => {
      if (newDebouncedSearchQuery && newDebouncedSearchQuery.length) {
        await fetchedSearchedData()
      } else {
        await fetchData()
      }
    })

    return {
      searchQuery,
      recipesList,
      error,
      loading,
      displayRecipe,
      selectedRecipe,
      minutesToHours,
      handleTextChange,
    }
  },
}
</script>

<template>
  <div class="container">
    <h1>Recipe Finder</h1>
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search recipe..."
        class="search-input"
        v-model="searchQuery"
        @input="handleTextChange"
      />
    </div>
    <div class="main-content">
      <div class="recipe-container">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else>
          <section>
            <h2>The Latest Recipes</h2>
            <div v-for="item in recipesList" :key="item.id" class="recipe-item">
              <div class="item-content" @click="displayRecipe(item.id)">
                <img class="recipe-icon-img" :src="item.image" />
                <p class="recipe-title">
                  {{ item.name }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="recipe-detail">
        <h2>Recipe Details</h2>
        <p v-if="!selectedRecipe">Select a meal to see the recipe here.</p>
        <div v-else>
          <h2>{{ selectedRecipe.name }}</h2>
          <img class="recipe-content-img" :src="selectedRecipe.image" />
          <div>
            <label>Cook Time:</label>
            <p>
              {{ selectedRecipe.cookTimeMinutes }} minutes &rarr;
              {{ minutesToHours(selectedRecipe.cookTimeMinutes) }} hrs
            </p>
          </div>
          <div>
            <label>Ingredients:</label>
            <div class="recipe-content">
              <template v-for="ingredient in selectedRecipe.ingredients" :key="ingredient">
                <p>&bull; {{ ingredient }}</p>
              </template>
            </div>
          </div>
          <div>
            <label>Instructions:</label>
            <div class="recipe-content">
              <template v-for="instruction in selectedRecipe.instructions" :key="instruction">
                <p>&bull; {{ instruction }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1500px;
  margin: 0 auto;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid gray;
  background: white;
}

.container h1 {
  text-align: center;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 97%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.recipe-container {
  width: 50%;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.item-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

img.recipe-icon-img {
  width: 25%;
  height: 100px;
  height: auto;
}

.recipe-detail {
  width: 50%;
}

.recipe-title {
  font-size: 1.25em;
  font-weight: bold;
}

.recipe-item {
  padding: 10px;
  cursor: pointer;
}

.recipe-item:hover {
  background: #f7f7f78c;
}

.recipe-content-img {
  width: 50%;
  height: auto;
}

.recipe-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.recipe-detail label {
  font-weight: bold;
}

.recipe-content {
  margin-left: 20px;
}
</style>
