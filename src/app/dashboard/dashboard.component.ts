import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  eventsByCategory: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: []
    }]
  };

  eventsByMonth: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Events per Month'
    }]
  };

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  private loadAnalytics() {
    this.eventService.getEvents().subscribe(events => {
      // Process events for category chart
      const categoryCount = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {});

      this.eventsByCategory.labels = Object.keys(categoryCount);
      this.eventsByCategory.datasets[0].data = Object.values(categoryCount);

      // Process events for monthly chart
      const monthCount = events.reduce((acc, event) => {
        const month = new Date(event.date).getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.eventsByMonth.labels = months;
      this.eventsByMonth.datasets[0].data = months.map((_, i) => monthCount[i] || 0);
    });
  }
}