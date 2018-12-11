import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DietService } from 'src/app/services/diet.service';
import { DietHistory } from 'src/app/model/diethistory';
import { RegisterService } from 'src/app/services/register.service';
import { User } from '../register/model/user';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { Meal } from 'src/app/model/abstarctmeal';
import { Food } from 'src/app/model/food';
import { Diet } from 'src/app/model/diet';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-diet-history',
  templateUrl: './diet-history.component.html',
  styleUrls: ['./diet-history.component.css']
})


export class DietHistoryComponent implements OnInit {

  private dietHistories: DietHistory[] = []
  private dietHistory2018: DietHistory[] = []
  private dietHistory2017: DietHistory[] = []
  constructor(private dietService: DietService,
    private registerService: RegisterService,
    public snack: MatSnackBar) { }

  getTodayDate() {
    return this.dietService.getTodayDate();
  }
  getFirtDayOfMonth() {
    return "01/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear().toString()
  }
  getCurrentMonth() {
    return this.dietService.getCurrentMonth();
  }
  loadOlderDietHistory(dietName: String) {
    var userId = JSON.parse(sessionStorage["user"]) as User
    this.dietService.getDietByName(dietName).subscribe(response => {
      var map: Map<DayOfWeek, Meal[]> = new Map();

      Object.keys(response.body.dailyFood).forEach(key => {
        var meals: Meal[] = []
        Object.values(response.body.dailyFood[key]).forEach(mealValue => {
          var meal = new Meal();
          var foodArray = mealValue["allFoodEntries"];
          Object.values(foodArray).forEach(value => {
            var food = new Food();
            food.calories = value["calories"];
            food.caloriesPer100 = value["caloriesPer100"]
            food.carbs = value["carbs"]
            food.fat = value["fat"]
            food.healthy = value["healthy"]
            food.mealTypes = value["mealTypes"]
            food.name = value["name"]
            food.proteins = value["proteins"]
            food.quantity = value["quantity"]
            food.type = value["type"]
            meal.addFood(food);
          })
          meal.mealType = mealValue["mealType"];
          meals.push(meal)
        })
        map.set(DayOfWeek[key], meals)


      });
      var caloriesPerDay: Map<DayOfWeek, number> = new Map()
      Object.keys(response.body.caloriesPerDay).forEach(key => {
        caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key])
      })

      var diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
      // this.currentDietName = diet.name;

      this.dietService.setDiet(diet);

    }, (error: HttpErrorResponse) => {
      if (error.status < 500) {
        console.log(error.error + " " + error.status)
        this.snack.open("Diet " + dietName + " could not be loaded, try later", "OK",
          {
            duration: 4000
          })

      }
      else {
        this.snack.open("Error with server, try later", "OK",
          {
            duration: 4000
          })

      }
    })


  }

  ngOnInit() {

    this.registerService.getUserObservable().subscribe(userIdChange => {
      this.dietService.getDietHistoryRecent(userIdChange).subscribe(response => {

        if (response.ok) {
          var dietHistoryFromServer: DietHistory[] = []
          Object.values(response.body).forEach(dietObject => {

            var timestamp = dietObject["timeStamp"];
            var name = dietObject["name"];
            var totalCalories = dietObject["totalCalories"]
            dietHistoryFromServer.push(new DietHistory(name, timestamp,totalCalories))

          })
          this.dietService.setObservableDietHistory(dietHistoryFromServer)
          this.dietService.getObservableDietHistory().subscribe(dietHistoriesChange => {
            this.dietHistories = dietHistoriesChange
          })

        }
      })
      this.dietService.getDietHistoriesByYear(new Date().getFullYear().toString()).subscribe(response => {
        if (response.ok) {
          
         
          Object.values(response.body).forEach(dietObject => {
            var timestamp:String = dietObject["timeStamp"];
            var month = timestamp.toString().substring(1,2);
            var name = dietObject["name"];
            var totalCalories = dietObject["totalCalories"]
            this.dietHistory2018.push(new DietHistory(name, timestamp,totalCalories))

          })


        }

      })
    })


  }

}
