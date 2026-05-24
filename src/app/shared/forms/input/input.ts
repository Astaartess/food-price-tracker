import { Component, input } from '@angular/core';
import { InputText } from '../utils/input-text';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-input',
  imports: [MatError, MatFormField, MatInput, MatLabel, FormField],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input extends InputText {
  public label = input<string>();
  public field = input.required<FieldTree<string>>();
}
