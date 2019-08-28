function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ul = document.getElementById("meals");

const h1 = document.getElementById("header")

  h1.addEventListener('click', () => {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    while (foodsUl.firstChild) {
      foodsUl.removeChild(foodsUl.firstChild)
    }
    render();
  })

const foodsUl = document.getElementById("foods");

const url = "http://localhost:3000/api/v1/meals"

const foodsUrl = "http://localhost:3000/api/v1/foods"

function addFoodToMeal(mealId, foodId) {
  fetch(url + `/${mealId}/foods/${foodId}`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  })
  .then(response => {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    while (foodsUl.firstChild) {
      foodsUl.removeChild(foodsUl.firstChild)
    }
    render();
  })
  .catch(error => {
    console.log(error);
  })
}

function getAvailableFoods(url, mealId) {
  fetch(url)
  .then((response) => response.json())
  .then(function(data) {

    data.map(function(food) {
      console.log(food)

      let li = createNode('li')
      let span = createNode('span')
      let button = createNode('button')

      span.innerHTML = `${food.name}, calories ${food.calories}`
      button.innerHTML = "Add Food to Meal"
      button.addEventListener('click', () => { addFoodToMeal(mealId, food.id) })

      append(span, button)
      append(li, span)
      append(foodsUl, li)
    })
  })
  .catch(function(error){
    console.log(JSON.stringify(error));
  })
}


function deleteFood(foodId, mealId) {
  fetch(url + `/${mealId}/foods/${foodId}`, {
  method: 'DELETE',
  headers: {'Content-Type': 'application/json'},
  })
  .then(response => {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    while (foodsUl.firstChild) {
      foodsUl.removeChild(foodsUl.firstChild)
    }
    render();
  })
  .catch(error => {
    console.log(error);
  })
}

function displayAddFoods (mealId) {

  getAvailableFoods(foodsUrl, mealId)

}

 //// fetch call for adding a food to a meal

//   fetch(url + `/${mealId}/foods/${foodId}`)
//   .then(() => {
//      mealShowPage(mealId)
//   })
//   .catch(function(error){
//     console.log(JSON.stringify(error));
//   })
// }

function mealShowPage(mealId) {
  fetch(url + `/${mealId}/foods`)
  .then((response) => response.json())
  .then(function(data) {

    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    let li = createNode('li')
    let span = createNode('span')
    let p = createNode('p')
    let ul2 = createNode('ul')

    span.innerHTML = `${data[0].name}`
    data[0]['Food'].forEach(function(element) {
      let li = createNode('li')
      let span2 = createNode('span')
      let button = createNode('button')

      span2.innerHTML = `${element.name}, calories: ${element.calories}`
      button.innerHTML = "Remove Food From Meal"


      button.addEventListener("click", () => { deleteFood(element.id, data[0].id) })

      append(span2, button)
      append(li, span2)
      append(ul2, li)
    });

    append(span, ul2);
    append(li, span);
    append(ul, li);

    displayAddFoods(data[0].id)

  })
  .catch(function(error){
    console.log(JSON.stringify(error));
  })
}

function render() {
  fetch(url)
  .then((response) => response.json())
  .then(function(data){
    data.map(function(meal) {
      let li = createNode('li');
      let span = createNode('span');
      let p = createNode('p')
      let ul2 = createNode('ul')

      span.innerHTML = `${meal.name}`
      span.addEventListener("click", () => { mealShowPage(meal.id) })

      meal['Food'].forEach(function(element) {
        let li = createNode('li')
        let span2 = createNode('span')

        span2.innerHTML = `${element.name}, calories: ${element.calories}`

        // append(span2, button)
        append(li, span2)
        append(ul2, li)
      });

      append(span, ul2)
      append(li, span);
      append(ul, li);

    })
  })
  .catch(function(error){
    console.log(JSON.stringify(error));
  })
}

render();
