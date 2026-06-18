import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  profile = {
    email: 'ali@gmail.com',
    fullName: 'Ahmed Abouelwafa',
    phone: '01006445854',
    company: 'Lrnova',
    industry: 'Education',
    gender: 'Male',
    timezone: 'Africa/Cairo (UTC+02:00)',
    language: 'English'
  };
}
