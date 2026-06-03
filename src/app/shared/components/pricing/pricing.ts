import { Component, inject } from '@angular/core';
import { LocalizationService } from '../../../core/services/localization.service';

@Component({
  selector: 'app-pricing',
  imports: [],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing {
  protected i18n = inject(LocalizationService);
}
