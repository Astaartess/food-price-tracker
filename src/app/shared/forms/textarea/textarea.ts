import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { InputText } from '../utils/input-text';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-textarea',
  imports: [MatFormField, MatInput, MatLabel, FormField],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
})
export class Textarea extends InputText {
  public label = input<string>();
  public field = input.required<FieldTree<string>>();
  public rows = input<number>(4);
}
