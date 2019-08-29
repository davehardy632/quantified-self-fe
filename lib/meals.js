class Meals{
  constructor(){
    this.mealFrame = document.getElementById("meal-frame"),
    this.foodFrame = document.getElementById("meal-food-frame"),
    this.heading = document.getElementById("meal-heading"),
    // this.mealUrl = "http://floating-savannah-19561.herokuapp.com/api/v1/meals",
    // this.foodsUrl = "http://floating-savannah-19561.herokuapp.com/api/v1/foods"
    this.mealUrl = "http://localhost:3000/api/v1/meals",
    this.foodsUrl = "http://localhost:3000/api/v1/foods"
  }

  createNode(element) {
    return document.createElement(element);
  }

  cleanup(element){
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  mealIndex() {
    this.cleanup(this.mealFrame);
    this.cleanup(this.foodFrame);
    fetch(this.mealUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(meal => {
        let div = this.createNode('div');
        div.className = "card"
        let cardtitle = this.createNode("h4")
        let cardList = document.createElement('ul')

        cardtitle.className = "card-title"
        cardtitle.innerHTML = `${meal.name}`
        cardtitle.addEventListener("click", () => { this.mealShowPage(meal.id) })
        meal['Food'].forEach(function(element) {
          cardList.className = "card-text"
          let li = document.createElement('li')
          li.innerHTML = `${element.name}, calories: ${element.calories}`

          cardList.appendChild(li);
        }.bind(this));
        div.appendChild(cardtitle);
        div.appendChild(cardList);
        this.foodFrame.appendChild(div);
      })
    })
    .catch(function(error){
      this.renderError(error);
    }.bind(this))
  }

  addFoodToMeal(mealId, foodId) {
    fetch(this.mealUrl + `/${mealId}/foods/${foodId}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
      this.mealIndex();
    })
    .catch(error => {
      this.renderError(error);
    })
  }

  getAllFoods(mealId) {
    fetch(this.foodsUrl)
    .then((response) => response.json())
    .then(data => {

      data.map(function(food) {
        let li = this.createNode('li')
        let div = this.createNode('div')
        div.className = "card"
        let ul = this.createNode('div')
        let button = this.createNode('button')

        li.innerHTML = `${food.name}, calories ${food.calories}`
        button.innerHTML = "Add Food to Meal"
        button.addEventListener('click', () => { this.addFoodToMeal(mealId, food.id) })

        div.appendChild(ul)
        ul.appendChild(li);
        ul.appendChild(button);
        this.foodFrame.appendChild(ul);
      }.bind(this))
    })
    .catch(function(error){
      this.renderError(error);
    })
  }

  deleteFood(foodId, mealId) {
    fetch(this.mealUrl + `/${mealId}/foods/${foodId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
      this.mealIndex();
    })
    .catch(error => {
      this.renderError(error);
    })
  }

  mealShowPage(mealId) {
    this.cleanup(this.mealFrame);
    this.cleanup(this.foodFrame);
    fetch(this.mealUrl + `/${mealId}/foods`)
    .then(response => response.json())
    .then(data => {
      let div = this.createNode('div')
      div.className = "card"
      let cardTitle = this.createNode('h4')
      let ul2 = this.createNode('ul')

      cardTitle.innerHTML = `${data[0].name}`
      cardTitle.className = "card-title"
      div.appendChild(cardTitle)
      data[0]['Food'].forEach(function(element) {
        let li = this.createNode('li')
        let span2 = this.createNode('div')
        let button = this.createNode('button')

        li.innerHTML = `${element.name}, calories: ${element.calories}`
        button.innerHTML = "Remove Food From Meal"

        button.addEventListener("click", () => { this.deleteFood(element.id, data[0].id) })

        ul2.appendChild(li)
        li.appendChild(button)
        div.appendChild(ul2)
      }.bind(this));

      div.appendChild(ul2);
      this.foodFrame.appendChild(div);
      this.getAllFoods(data[0].id)
    })
    .catch(function(error){
      console.log(error)
      this.renderError(error);
    }.bind(this))
  }

  renderError(error){
    let alert = document.getElementById("alert-row");
    this.cleanup(alert)
    let page = document.getElementById("alert-row");
    let newSpan = this.createNode("span");
    newSpan.className = "alert alert-danger";
    newSpan.id = "flash-alert"
    newSpan.innerHTML = error;
    page.appendChild(newSpan);
  }
}

let meal = new Meals();
meal.mealIndex();
meal.heading.addEventListener('click', () => { meal.mealIndex();} )
