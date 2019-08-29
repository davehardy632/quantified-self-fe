class Foods{
  constructor(){
    // this.foodsUrl = "http://floating-savannah-19561.herokuapp.com/api/v1/foods"
    this.foodsUrl = "http://localhost:3000/api/v1/foods"
  }

  createNode(element){
    return document.createElement(element);
  }

  fetchAllFoods(){
    fetch(this.foodsUrl)
    .then((res) => res.json())
    .then((data) => {
      this.showAllFoods(data);
    })
  }

  fetchSingleFood(id){
    fetch(this.foodsUrl + `/${id}`)
    .then((res) => res.json())
    .then((data) => {
      this.showSingleFood(data);
    })
  }

  cleanup(element){
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  createSingleFood(data){
    fetch(this.foodsUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
      if(!data.error){
        this.showSingleFood(data);
      } else {
        this.renderError("Food could not be updated.");
      }
    })
  }

  deleteSingleFood(id){
    fetch(this.foodsUrl + `/${id}`, {
      method: 'DELETE',
    })
    .then((data) => {
      if(!data.error){
        this.fetchAllFoods();
      } else {
        this.renderError("Food could not be deleted.");
      }
    })
  }

  updateSingleFood(id, data){
    fetch(this.foodsUrl+`/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
      if(!data.error){
        this.showSingleFood(data);
      } else {
        this.renderError("Food could not be updated.");
      }
    })
  }

  showAllFoods(allFoods){
    let list = document.getElementById("food-frame");
    this.cleanup(list)
    let alert = document.getElementById("alert-row");
    this.cleanup(alert)
    allFoods.forEach((element) => {
      let newDiv = this.createNode("div");
      newDiv.className = "card";
      let foodName = this.createNode("h4");
      foodName.className = "card-title";
      foodName.innerHTML = element.name;
      foodName.addEventListener("click", () => {this.fetchSingleFood(element.id);}, true);
      let foodCalories = this.createNode("p");
      foodCalories.innerHTML = `Calories: ${element.calories}`;
      foodCalories.className = "card-text";
      newDiv.appendChild(foodName);
      newDiv.appendChild(foodCalories);
      list.appendChild(newDiv);
    })
  }

  showSingleFood(singleFood){
    let list = document.getElementById("food-frame");
    this.cleanup(list)
    let alert = document.getElementById("alert-row");
    this.cleanup(alert)
    let newDiv = this.createNode("div");
    newDiv.className = "card";
    let foodName = this.createNode("h4");
    foodName.innerHTML = singleFood.name;
    foodName.className = "card-title";
    let foodCalories = this.createNode("p");
    foodCalories.innerHTML = `Calories: ${singleFood.calories}`;
    foodCalories.className = "card-text";
    let foodId = this.createNode("p");
    foodId.innerHTML = `ID: ${singleFood.id}`;
    let foodDeleteButton = this.createNode("button");
    foodDeleteButton.innerHTML = "Delete This Food Item";
    foodDeleteButton.addEventListener("click",  () => {food.deleteSingleFood(singleFood.id);}, true);
    let foodUpdateForm = this.createNode("div");
    foodUpdateForm.className = "form"
    let foodUpdateNameLabel = this.createNode("label");
    foodUpdateNameLabel.for = "name"
    foodUpdateNameLabel.className = "update-input"
    let foodUpdateNameInput = this.createNode("input");
    foodUpdateNameInput.className = "update-input"
    foodUpdateNameInput.id = "food-name-update-input"
    foodUpdateNameInput.type = "text"
    foodUpdateNameInput.placeholder = "New Name of Food"
    let foodUpdateCaloriesLabel = this.createNode("label");
    foodUpdateCaloriesLabel.for = "calories"
    foodUpdateCaloriesLabel.className = "update-input"
    let foodUpdateCaloriesInput = this.createNode("input");
    foodUpdateCaloriesInput.className = "update-input"
    foodUpdateCaloriesInput.id = "food-calories-update-input"
    foodUpdateCaloriesInput.type = "number"
    foodUpdateCaloriesInput.placeholder = "New Number of Calories"
    let foodUpdateButton = this.createNode("button");
    foodUpdateButton.innerHTML = "Update This Food Item";
    foodUpdateButton.addEventListener("click",  () => {food.updateFood(singleFood.id);}, true);
    newDiv.appendChild(foodName);
    newDiv.appendChild(foodCalories);
    newDiv.appendChild(foodId);
    foodUpdateNameLabel.appendChild(foodUpdateNameInput);
    foodUpdateForm.appendChild(foodUpdateNameLabel);
    foodUpdateCaloriesLabel.appendChild(foodUpdateCaloriesInput);
    foodUpdateForm.appendChild(foodUpdateCaloriesLabel);
    newDiv.appendChild(foodUpdateForm);
    newDiv.appendChild(foodUpdateButton);
    newDiv.appendChild(foodDeleteButton);
    list.appendChild(newDiv);
  }

  createFood(){
    event.preventDefault();
    this.createSingleFood({food: {name: document.getElementById("food-name-input").value, calories: document.getElementById("food-calories-input").value}})
    document.getElementById("food-name-input").value = '';
    document.getElementById("food-calories-input").value = '';
  }

  updateFood(id){
    event.preventDefault();
    let input = {food:{name: null, calories: null}}
    if (document.getElementById("food-name-update-input")) {
      input["food"]["name"] = document.getElementById("food-name-update-input").value
    }
    if (document.getElementById("food-calories-update-input")) {
      input["food"]["calories"] = document.getElementById("food-calories-update-input").value
    }
    this.updateSingleFood(id, input)
    document.getElementById("food-name-update-input").value = '';
    document.getElementById("food-calories-update-input").value = '';
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

let food = new Foods();
document.getElementById("food-button").addEventListener("click",  () => {food.fetchAllFoods();}, true);
document.getElementById("create-food-button").addEventListener("click",  () => {food.createFood();}, true);
