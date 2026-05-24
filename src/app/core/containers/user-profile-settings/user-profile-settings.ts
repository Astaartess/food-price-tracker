import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileSettingsPageStore } from './user-profile-settings.page-store';
import { UserProfileSettingsStore } from '../../services/user-profile-settings.store';
import { getCurrencyOptions } from '../../../utils/get-currency-options';
import { CurrencyCode } from '../../../types/currency-code';

@Component({
  selector: 'app-user-profile-settings',
  imports: [MatButtonModule],
  templateUrl: './user-profile-settings.html',
  styleUrl: './user-profile-settings.scss',
  providers: [UserProfileSettingsPageStore],
})
export class UserProfileSettings implements OnInit {
  protected pageStore = inject(UserProfileSettingsPageStore);
  protected settingsStore = inject(UserProfileSettingsStore);
  protected currencyOptions = getCurrencyOptions();

  public ngOnInit(): void {
    this.settingsStore.load();
  }

  protected setDefaultCurrency(currency: CurrencyCode): void {
    this.settingsStore.setDefaultCurrency(currency);
  }
}
