import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { DataManagerService } from '../data-manager.service';
import { spendingList } from './spendingList';
import { Data } from './usersData';
import { spendings } from '../Models/spendingsList';
import { Chart, registerables } from 'node_modules/chart.js';
import { Router } from '@angular/router';
import { PieChart } from 'echarts/charts';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent} from 'echarts/components'
Chart.register(...registerables);

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  readonly echartsExtentions: any[];
  echartsOptions: any = {};

  barchartOptions: any = {};
  readonly barchartsExptentions: any[];

  balance: number = 0

  savings: number;
  savingsBalance: number = 0
  spending: number;
  income: number;
  daily = false;
  dailySpend: string
  slider = false;
  disc: string;
  spendings: spendingList[] = []
  date: Date = new Date()
  id: string;
  newArr: Data[] = []
  spendingsBalance: number = 0
  user: Observable<any>;

  spend: spendings[] = [];

  catArray: any = []
  catBal: any = []
  displayName: any
  sum: any = 0

  pieArr: any = []
  constructor(private dm: DataManagerService, private af: AngularFireAuth, private fs: AngularFirestore, private router: Router) {
    this.echartsExtentions = [PieChart, TooltipComponent, GridComponent, LegendComponent];
    this.barchartsExptentions = [BarChart,TooltipComponent,GridComponent,LegendComponent];

    if (this.dm.LoggedIn == false) {
      this.router.navigate(['/login']);
    }
    this.dm.getData().subscribe((res: any) => {
      this.displayName = res.username
      this.balance = res.MainBalance
      this.savingsBalance = res.SavingsBalance
      this.spendingsBalance = res.SpendingsBalance
    })

   

  }

  public dropData = [{ id: "House & Rent", name: "House & Rent" },
  { id: "Food & Beverages", name: "Food & Beverages" },
  { id: "Entertainment & Travel", name: "Entertainment & Travel" },
  { id: "Bills & Depts", name: "Bills & Depts" },
  { id: "Cars & Maintenance", name: "Cars & Maintenance" },
  { id: "Personal", name: "Personal" },
  { id: "Friends & Family", name: "Friends & Family" },
  { id: "Clothes", name: "Clothes" },
  { id: "Shopping", name: "Shopping" }
  ];

  getSpending() {
    this.dm.getSp().subscribe((data) => {
      this.spend = data
      console.log(this.spend)
      for (let i = 0; i < this.dropData.length; i++) {
        this.catArray.push(this.dropData[i].name)
        for (let j = 0; j < this.spend.length; j++) {

          if (this.dropData[i].name == this.spend[j].name) {
            this.sum = this.sum + this.spend[j].cost

          }

        }
        this.catBal.push(this.sum)
        this.sum = 0
      }
      console.log(this.catArray)
      console.log(this.catBal)
      for(let i=0; i<this.spend.length; i++){
        this.pieArr.push({value : this.catBal[i],name: this.catArray[i]})
      }
      console.log(this.pieArr)
      this.barChart()
      this.echart(this.pieArr)
      this.catArray = []
      this.catBal = []
      this.pieArr = []
    })
  }
  deductBalance() {
    this.balance = this.balance - (this.spending || this.savings);
    if (this.savings) {
      this.savingsBalance = this.savingsBalance + this.savings;
      this.savings = 0
    }
    this.dm.updateBalance(this.balance, this.savingsBalance, this.spendingsBalance)
    this.dailySpending();
  }

  addBalance() {

    this.balance = this.balance + this.income;
    this.income = 0;
    this.dm.updateBalance(this.balance, this.savingsBalance, this.spendingsBalance)
    this.dailySpending();
  }
  dailySpending() {
    this.dailySpend = (Math.round((this.balance / 30) * 100) / 100).toFixed(2);
  }


  addData() {
    this.spendingsBalance = this.spendingsBalance + this.spending
    this.dm.addData(this.id, this.date.toDateString(), this.spending)
    this.deductBalance()
    this.dm.updateBalance(this.balance, this.savingsBalance, this.spendingsBalance)
    this.getSpending()

  }
  logout(): void{
    this.dm.logoutUser()
  }

  echart(chartD:any){
    
    this.echartsOptions = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      color : ["#001285","#272075","#332A99","#3D3AB6","#3F33BD","#5A4FCF","#7C73D9","#9E97E3","#BFBBED"],
      darkMode:true,
      series: [
        {
          name: 'Amount of spending',
          type: 'pie',
          radius: '75%',
          data:chartD,
          emphasis: {
            itemStyle: {
              shadowBlur: 50,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0)'
            }
          }
        }
      ]
    };
  }


  barChart(){
    this.barchartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        containLabel: true
      },
      color : ["#272075","#332A99","#3D3AB6","#3F33BD","#5A4FCF","#7C73D9","#9E97E3"],
      xAxis: [
        {
          type: 'category',
          data: this.catArray,
          
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: this.catBal
        }
      ]
    };
  }

  ngOnInit() {

    
    this.getSpending()
    

    this.af.authState.subscribe(user => {

      if (user) {
        this.displayName = user.displayName
        console.log(this.displayName)
      }

    })


  }


}
