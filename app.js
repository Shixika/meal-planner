let ingredients = JSON.parse(localStorage.getItem("ingredients")) || []
let recipes = JSON.parse(localStorage.getItem("recipes")) || []
let planning = JSON.parse(localStorage.getItem("planning")) || {}

function save() {
  localStorage.setItem("ingredients", JSON.stringify(ingredients))
  localStorage.setItem("recipes", JSON.stringify(recipes))
  localStorage.setItem("planning", JSON.stringify(planning))
}

function showTab(tab) {

  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"))

  document.getElementById(tab).classList.remove("hidden")

}

function addIngredient() {

  let name = document.getElementById("ing-name").value
  let qty = parseInt(document.getElementById("ing-qty").value)
  let date = document.getElementById("ing-date").value

  ingredients.push({ name, qty, date })

  save()

  renderIngredients()

}

function renderIngredients() {

  let search = document.getElementById("search-ingredients").value.toLowerCase()

  let list = document.getElementById("ingredients-list")

  list.innerHTML = ""

  ingredients
    .filter(i => i.name.toLowerCase().includes(search))
    .forEach((i, index) => {

      let tr = document.createElement("tr")

      let diff = (new Date(i.date) - new Date()) / 86400000

      let cls = "ok"

      if (diff < 0) cls = "expired"
      else if (diff < 3) cls = "soon"

      tr.className = cls

      tr.innerHTML = `

<td>${i.name}</td>
<td>${i.qty}</td>
<td>${i.date}</td>
<td><button onclick="deleteIngredient(${index})">X</button></td>

`

      list.appendChild(tr)

    })

}

function deleteIngredient(i) {

  ingredients.splice(i, 1)

  save()

  renderIngredients()

}

function addRecipe() {

  let name = document.getElementById("recipe-name").value

  let r = {
    name,
    ingredients: []
  }

  recipes.push(r)

  save()

  renderRecipes()

}

function renderRecipes() {

  let search = document.getElementById("search-recipes").value.toLowerCase()

  let div = document.getElementById("recipes-list")

  div.innerHTML = ""

  recipes
    .filter(r => r.name.toLowerCase().includes(search))
    .forEach((r, ri) => {

      let d = document.createElement("div")

      d.className = "recipe"

      let html = `<h3>${r.name}</h3>`

      r.ingredients.forEach((i, ii) => {

        html += `${i.name} : ${i.qty}<br>`

      })

      html += `

<input placeholder="Ingrédient" id="ri-${ri}">
<input type="number" placeholder="Quantité" id="rq-${ri}">
<button onclick="addRecipeIngredient(${ri})">Ajouter</button>

`

      d.innerHTML = html

      div.appendChild(d)

    })

}

function addRecipeIngredient(ri) {

  let name = document.getElementById(`ri-${ri}`).value

  let qty = parseInt(document.getElementById(`rq-${ri}`).value)

  recipes[ri].ingredients.push({ name, qty })

  save()

  renderRecipes()

}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

function renderPlanning() {

  let div = document.getElementById("planning-table")

  div.innerHTML = ""

  days.forEach(day => {

    let d = document.createElement("div")

    d.className = "planning-day"

    let html = `<h3>${day}</h3>`

      ;["midi", "soir"].forEach(moment => {

        let key = day + "-" + moment

        let current = planning[key]

        html += `<b>${moment}</b> : `

        if (current) {

          html += `${current} <button onclick="removeMeal('${key}')">X</button><br>`

        } else {

          html += `<select onchange="addMeal('${key}',this.value)">
<option value="">Choisir recette</option>
`

          recipes.forEach(r => {

            if (canCook(r))
              html += `<option>${r.name}</option>`

          })

          html += `</select><br>`

        }

      })

    d.innerHTML = html

    div.appendChild(d)

  })

}

function canCook(recipe) {

  for (let ri of recipe.ingredients) {

    let ing = ingredients.find(i => i.name === ri.name)

    if (!ing || ing.qty < ri.qty) return false

  }

  return true

}

function addMeal(key, name) {

  let recipe = recipes.find(r => r.name === name)

  if (!recipe) return

  for (let ri of recipe.ingredients) {

    let ing = ingredients.find(i => i.name === ri.name)

    ing.qty -= ri.qty

  }

  planning[key] = name

  save()

  renderIngredients()

  renderPlanning()

}

function removeMeal(key) {

  let name = planning[key]

  let recipe = recipes.find(r => r.name === name)

  for (let ri of recipe.ingredients) {

    let ing = ingredients.find(i => i.name === ri.name)

    ing.qty += ri.qty

  }

  delete planning[key]

  save()

  renderIngredients()

  renderPlanning()

}

renderIngredients()

renderRecipes()

renderPlanning()