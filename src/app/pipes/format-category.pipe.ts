import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCategory',
  standalone: true
})
export class FormatCategoryPipe implements PipeTransform {

  transform(value: string): string {
    return value.toUpperCase();
  }

}
