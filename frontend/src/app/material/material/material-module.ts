import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export const MaterialModule = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSelectModule,
  MatOptionModule,
  MatDividerModule,  
  MatButtonModule,
  MatListModule,
  MatProgressSpinnerModule,
];