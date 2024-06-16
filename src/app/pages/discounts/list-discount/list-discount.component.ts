import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { API_DISCOUNTS } from 'app/@core/config/api-endpoint.config';
import { DiscountsService } from 'app/@core/services/apis/discounts.service';
import { DialogConfirmComponent } from 'app/@theme/components/dialog-confirm/dialog-confirm.component';
import { AlertShowcaseComponent, IAlertMessage } from 'app/@theme/components/alert/ngx-alerts.component';

export interface Idiscount {
  id: string;
  img: string;
  nameDiscount: string;
  startDate: string;
  endDate: string;
  status: string;
  contentDiscount: string;
}

@Component({
  selector: 'app-list-discount',
  templateUrl: './list-discount.component.html',
  styleUrls: ['./list-discount.component.scss']
})
export class ListDiscountComponent {
  lisDiscounts: Idiscount[] = [];
  originalDiscounts: Idiscount[] = [];
  deleteNotification: boolean = false;
  lastPage: number = 0;
  currentPage: number = 0;
  apiUrl = API_DISCOUNTS;
  private _listFilter: string = '';

  @ViewChild('alertContainer', { read: ViewContainerRef, static: true }) alertContainer: ViewContainerRef;

  constructor(
    private discount: DiscountsService,
    private dialogService: NbDialogService,
    private cfr: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDiscounts();
  }

  getDiscounts() {
    this.discount.getDiscount().subscribe(res => {
      console.log(res);
      this.lisDiscounts = res.data;
      this.originalDiscounts = res.data;
      this.currentPage = res.meta.current_page;
      this.lastPage = res.meta.last_page;
    }, err => {
      console.error(err);
    });
  }

  getPage(res: any) {
    this.lisDiscounts = res.data;
    this.currentPage = res.meta.current_page;
    this.lastPage = res.meta.last_page;
  }

  openDeleteDialog(id: number): void {
    this.dialogService.open(DialogConfirmComponent, {
      context: {
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa sự kiện này không?'
      }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.btnDelete(id);
      }
    });
  }

  showAlert(message: IAlertMessage) {
    const alertFactory = this.cfr.resolveComponentFactory(AlertShowcaseComponent);
    const alertRef = this.alertContainer.createComponent(alertFactory);
    alertRef.instance.messages = [message];
    this.cdr.detectChanges();

    setTimeout(() => {
      alertRef.destroy();
      this.cdr.detectChanges();
    }, 3000);
  }

  btnDelete(id: number): void {
    this.discount.deleteDiscount(id).subscribe(
      res => {
        this.deleteNotification = true;
        setTimeout(() => {
          this.deleteNotification = false;
        }, 1500);
        this.getDiscounts();
      },
      err => {
        console.error(err);
        this.showAlert({ status: 'danger', message: 'Xóa thất bại!' });
      }
    );
  }

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.lisDiscounts = this.listFilter
      ? this.performFilter(this.listFilter)
      : this.originalDiscounts;
  }

  performFilter(filterBy: string): Idiscount[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.originalDiscounts.filter((discount: Idiscount) =>
      discount.nameDiscount.toLocaleLowerCase().includes(filterBy)
    );
  }
}
