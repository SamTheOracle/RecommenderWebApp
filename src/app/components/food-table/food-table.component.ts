import { Component, OnInit, HostListener } from '@angular/core';
import { FoodCategory } from 'src/app/model/FoodCategory';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { map } from 'rxjs/operators';
import { filter } from 'rxjs/operators'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-food-table',
  templateUrl: './food-table.component.html',
  styleUrls: ['./food-table.component.css']
})
export class FoodTableComponent implements OnInit {

  private foodCategories: FoodCategory[];
  private foodCategorySelected: FoodCategory;
  private routerSub = Subscription.EMPTY;
  numberOfCols = 4;
  rowHeight = "4:5";
  constructor(private foodRecommenderService: FoodRecommenderService, private router: Router, private route: ActivatedRoute) { }

  onFoodCategorySelected(foodCategory: FoodCategory) {
    this.foodCategorySelected = foodCategory;
    this.foodRecommenderService.setNewFoodCategory(this.foodCategorySelected)
    this.router.navigate(["/home/food/" + foodCategory.categoryName.replace(/ /g,'')])

  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if (event.target.innerWidth <= 640) {
      this.numberOfCols = 1;
    }
    if (event.target.innerWidth > 1280) {
      this.numberOfCols = 4;
    }
    if (event.target.innerWidth > 640 && event.target.innerWidth < 1280) {
      this.numberOfCols = 2;
    }
    if (event.target.innerWidth < 380) {
      console.log(event.target.innerWidth)
      this.rowHeight = "2:3"
    }
    else {
      this.rowHeight = "4:5";
    }
  }

  ngOnInit() {
    this.dynamicColsAndRowHeightGridList();
    const url = this.router.url;
    if (url !== "/home/food") {
      
      var parsedUrl = url.split("/home/food/");
      var categoryName = parsedUrl[1];
      this.foodCategorySelected = this.foodRecommenderService.getCategory(categoryName)
      this.foodRecommenderService.setNewFoodCategoryByName(categoryName);
      console.log(parsedUrl)
    }
    this.foodCategories = this.foodRecommenderService.getFoodCategories();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(event.url)
        if (event.url === "/home/food") {
          this.foodCategorySelected = null;
          console.log(this.foodCategorySelected)
        }
        else {
          var parsedUrl = event.url.split("/home/food/");
          var categoryName = parsedUrl[1];
          this.foodCategorySelected = this.foodRecommenderService.getCategory(categoryName)
          this.foodRecommenderService.setNewFoodCategoryByName(categoryName);
          console.log(parsedUrl)
        }
      }

    })


  }
  ngOnDestroy() {
    // this.routerSub.unsubscribe();
  }
  private dynamicColsAndRowHeightGridList() {
    var innerWidth = window.innerWidth;
    if (innerWidth <= 640) {
      this.numberOfCols = 1;
    }
    if (innerWidth > 1280) {
      this.numberOfCols = 4;
    }
    if (innerWidth > 640 && innerWidth < 1280) {
      this.numberOfCols = 2;
    }
    if (innerWidth < 380) {
      this.rowHeight = "2:3"
    }
    else {
      this.rowHeight = "4:5";
    }
  }
}
