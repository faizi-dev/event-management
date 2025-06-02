import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoverDetailDirective } from '../directives/hover-detail.directive';
import { FormatCategoryPipe } from '../pipes/format-category.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,FormsModule,HoverDetailDirective,FormatCategoryPipe],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent implements OnInit {
  events : any = [];
  filteredEvents: any = [];
  
  newEvent = { title: '', date: '', location: '', description: '', category: '' };
  filters = { category: '', date: '' };

  editingEvent: any = null; // Holds the event being edited

  showAddEventForm = false;

  constructor(
    private eventService: EventService,
    private router : Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.filteredEvents = data;
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    );
  }

  addEvent() {
    if (this.newEvent.title && this.newEvent.date && this.newEvent.location && this.newEvent.category) {
      this.eventService.addEvent(this.newEvent).subscribe(
        () => {
          this.newEvent = { title: '', date: '', location: '', description: '', category: '' };
          this.showAddEventForm = false;
          this.loadEvents();
        },
        (error) => {
          console.error('Error adding event:', error);
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

  editEvent(event: any) {
    this.editingEvent = { ...event };
  }

  updateEvent() {
    if (this.editingEvent) {
      this.eventService.updateEvent(this.editingEvent).subscribe(
        () => {
          this.editingEvent = null;
          this.loadEvents();
        },
        (error) => {
          console.error('Error updating event:', error);
        }
      );
    }
  }

  deleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(
        () => {
          this.loadEvents();
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    }
  }

  cancelEdit() {
    this.editingEvent = null; // Exit edit mode without saving
  }

  toggleAddEventForm() {
    this.showAddEventForm = true;
  }

  cancelAddEvent() {
    this.showAddEventForm = false;
  }

  applyFilters() {
    this.filteredEvents = this.events.filter((event:any) => {
      const matchesCategory =
        !this.filters.category || event.category.toLowerCase().includes(this.filters.category.toLowerCase());
      
        const eventDate = new Date(event.date).toLocaleDateString('en-CA'); // Format as 'YYYY-MM-DD' in local time
        const matchesDate = !this.filters.date || eventDate === this.filters.date;
    
        return matchesCategory && matchesDate;  
    });
  }

  resetFilters() {
    this.filters = { category: '', date: '' };
    this.filteredEvents = this.events;
  }

  refreshEventList() {
    this.events = this.eventService.getEvents();
    this.applyFilters(); // Re-apply filters to ensure the filtered list is updated
  }

  // Logout function
  logout() {
    this.eventService.logout().subscribe(
      (response) => {
        // On successful logout, navigate to the login page
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout failed:', error);
      }
    );
  }
}
