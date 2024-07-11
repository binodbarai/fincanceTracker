import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-table',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './finance-table.component.html',
  styleUrl: './finance-table.component.scss'
})
export class FinanceTableComponent implements OnInit {
  expenseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      years: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Initialize with one year
    this.addYear();
  }

  get years(): FormArray {
    return this.expenseForm.get('years') as FormArray;
  }

  addYear() {
    const yearForm = this.fb.group({
      year: ['', Validators.required],
      months: this.fb.array([])
    });
    this.years.push(yearForm);
    this.addMonth(this.years.length - 1);
  }

  removeYear(yearIndex: number) {
    this.years.removeAt(yearIndex);
  }

  getMonths(yearIndex: number): FormArray {
    return this.years.at(yearIndex).get('months') as FormArray;
  }

  addMonth(yearIndex: number) {
    const monthForm = this.fb.group({
      name: ['', Validators.required],
      expenses: this.fb.array([])
    });
    this.getMonths(yearIndex).push(monthForm);
    this.addExpense(yearIndex, this.getMonths(yearIndex).length - 1);
  }

  removeMonth(yearIndex: number, monthIndex: number) {
    this.getMonths(yearIndex).removeAt(monthIndex);
  }

  getExpenses(yearIndex: number, monthIndex: number): FormArray {
    return this.getMonths(yearIndex).at(monthIndex).get('expenses') as FormArray;
  }

  addExpense(yearIndex: number, monthIndex: number) {
    const expenseForm = this.fb.group({
      amount: ['', Validators.required]
    });
    this.getExpenses(yearIndex, monthIndex).push(expenseForm);
  }

  removeExpense(yearIndex: number, monthIndex: number, expenseIndex: number) {
    this.getExpenses(yearIndex, monthIndex).removeAt(expenseIndex);
  }

  addItem() {
    this.years.controls.forEach((yearControl, yearIndex) => {
      const months = this.getMonths(yearIndex);
      months.controls.forEach((_, monthIndex) => {
        this.addExpense(yearIndex, monthIndex);
      });
    });
  }
}